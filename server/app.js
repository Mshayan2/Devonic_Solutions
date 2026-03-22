const express = require('express')
const cors = require('cors')
const app = express()

// add global CORS so all /api/* endpoints accept requests from dev origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. curl, server-to-server)
    if (!origin) return callback(null, true)
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.options('*', cors())

const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { readDB, writeDB } = require('../db')

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'devonic_secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET || 'devonic_refresh'
const ACCESS_EXPIRES = '15m'
const REFRESH_EXPIRES = '7d'

function createAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}
function createRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES })
}

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  
  // Basic validation
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email format' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const db = readDB()
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Identity already registered' })
  
  const hash = await bcrypt.hash(password, 10)
  const userRole = (role === 'admin') ? 'admin' : 'user'
  
  const user = { 
    id: Date.now().toString(), 
    name: name || email.split('@')[0], 
    email, 
    password: hash, 
    role: userRole 
  }
  
  db.users.push(user)
  writeDB(db)
  
  const access = createAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role })
  const refresh = createRefreshToken({ id: user.id })
  
  res.json({ 
    accessToken: access, 
    refreshToken: refresh, 
    user: { id: user.id, email: user.email, name: user.name, role: user.role } 
  })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  const db = readDB()
  const user = db.users.find(u => u.email === email)
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const access = createAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role })
  const refresh = createRefreshToken({ id: user.id })
  res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// Refresh
router.post('/refresh', (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(token, REFRESH_SECRET)
    const db = readDB()
    const user = db.users.find(u => u.id === payload.id)
    if (!user) return res.status(400).json({ error: 'Invalid token' })
    const access = createAccessToken({ id: user.id, email: user.email, name: user.name, role: user.role })
    res.json({ accessToken: access })
  } catch (e) {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// Whoami
router.get('/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.json({ user: null })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.json({ user: null })
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET)
    res.json({ user: payload })
  } catch (e) {
    res.json({ user: null })
  }
})

module.exports = app