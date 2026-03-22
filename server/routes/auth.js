const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const fs = require('fs')
const path = require('path')

// JWT secrets - require environment variables in production
const isProduction = process.env.NODE_ENV === 'production'

// Generate a secure random secret for development (32 bytes = 256 bits)
function generateDevSecret() {
  return crypto.randomBytes(32).toString('hex')
}

// Validate JWT secret minimum length (32 characters for security)
function validateSecret(secret, name) {
  if (!secret || secret.length < 32) {
    throw new Error(`${name} must be at least 32 characters long for security`)
  }
  return secret
}

// Get secrets with validation
let JWT_SECRET, REFRESH_SECRET

if (isProduction) {
  JWT_SECRET = validateSecret(
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    'JWT_ACCESS_SECRET or JWT_SECRET'
  )
  REFRESH_SECRET = validateSecret(
    process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET,
    'JWT_REFRESH_SECRET or REFRESH_SECRET'
  )
} else {
  // Development: use env vars if provided and valid, otherwise generate secure random secrets
  const devJwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  const devRefreshSecret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET
  
  JWT_SECRET = devJwtSecret && devJwtSecret.length >= 32 
    ? devJwtSecret 
    : generateDevSecret()
  REFRESH_SECRET = devRefreshSecret && devRefreshSecret.length >= 32 
    ? devRefreshSecret 
    : generateDevSecret()
    
  if (!devJwtSecret || devJwtSecret.length < 32) {
    console.warn('[AUTH] Using auto-generated secure JWT secret for development')
  }
}

const ACCESS_EXPIRES = '15m'
const REFRESH_EXPIRES = '7d'


function createAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}
function createRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES })
}

// Validation helpers
function validateName(name) {
  if (!name || typeof name !== 'string') return { valid: false, error: 'Name is required' }
  const trimmed = name.trim()
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' }
  if (trimmed.length > 50) return { valid: false, error: 'Name must be at most 50 characters' }
  // Allow letters, spaces, hyphens, apostrophes (common in names)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  return { valid: true, value: trimmed }
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email is required' }
  const trimmed = email.trim().toLowerCase()
  // Stricter email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) return { valid: false, error: 'Invalid email format' }
  if (trimmed.length > 254) return { valid: false, error: 'Email is too long' }
  return { valid: true, value: trimmed }
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return { valid: false, error: 'Password is required' }
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' }
  if (password.length > 128) return { valid: false, error: 'Password is too long' }
  // Check for at least one uppercase, one lowercase, and one number
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' }
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain at least one lowercase letter' }
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain at least one number' }
  return { valid: true }
}


// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  
  // Validate all fields
  const nameValidation = validateName(name)
  if (!nameValidation.valid) return res.status(400).json({ error: nameValidation.error })
  
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) return res.status(400).json({ error: emailValidation.error })
  
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) return res.status(400).json({ error: passwordValidation.error })

  const db = readDB()
  const normEmail = emailValidation.value
  if (db.users.find(u => (u.email || '').toString().toLowerCase() === normEmail)) {
    return res.status(400).json({ error: 'Identity already registered' })
  }
  
  const hash = await bcrypt.hash(password, 10)
  const userRole = 'user'
  
  const user = { 
    id: Date.now().toString(), 
    name: nameValidation.value, 
    email: normEmail, 
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


// Admin invite (invite-only admin creation)
router.post('/invite', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, role } = req.body
  
  // Validate name if provided
  let validatedName = null
  if (name) {
    const nameValidation = validateName(name)
    if (!nameValidation.valid) return res.status(400).json({ error: nameValidation.error })
    validatedName = nameValidation.value
  }
  
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) return res.status(400).json({ error: emailValidation.error })

  const db = readDB()
  const normEmail = emailValidation.value
  if (db.users.find(u => (u.email || '').toString().toLowerCase() === normEmail)) {
    return res.status(400).json({ error: 'User already exists' })
  }

  const tempPassword = `Temp-${Math.random().toString(36).slice(2, 10)}`
  const hash = await bcrypt.hash(tempPassword, 10)
  const userRole = role === 'admin' ? 'admin' : 'user'

  const user = {
    id: Date.now().toString(),
    name: validatedName || normEmail.split('@')[0],
    email: normEmail,
    password: hash,
    role: userRole
  }

  db.users.push(user)
  writeDB(db)

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tempPassword
  })
})


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Basic validation
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
  
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) return res.status(400).json({ error: 'Invalid email format' })
  
  const db = readDB()
  const user = db.users.find(u => u.email === emailValidation.value)
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

// Update current user profile (name, gmail, whatsapp)
router.put('/me', verifyToken, async (req, res) => {
  const { name, gmail, whatsapp } = req.body
  try {
    // Validate name if provided
    if (name !== undefined) {
      const nameValidation = validateName(name)
      if (!nameValidation.valid) return res.status(400).json({ error: nameValidation.error })
    }
    
    // Validate gmail if provided
    if (gmail !== undefined && gmail !== null && gmail !== '') {
      const gmailValidation = validateEmail(gmail)
      if (!gmailValidation.valid) return res.status(400).json({ error: 'Invalid Gmail format' })
    }
    
    // Validate whatsapp if provided (basic phone validation)
    if (whatsapp !== undefined && whatsapp !== null && whatsapp !== '') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/
      if (!phoneRegex.test(whatsapp)) {
        return res.status(400).json({ error: 'Invalid WhatsApp number format' })
      }
    }
    
    const db = readDB()
    const auth = req.headers.authorization
    const parts = auth.split(' ')
    const payload = jwt.verify(parts[1], JWT_SECRET)
    const user = db.users.find(u => u.id === payload.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (typeof name === 'string') user.name = name.trim()
    if (typeof gmail === 'string') user.gmail = gmail.trim().toLowerCase()
    if (typeof whatsapp === 'string') user.whatsapp = whatsapp.trim()
    writeDB(db)
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, gmail: user.gmail || null, whatsapp: user.whatsapp || null } })
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})


// Admin: list users
router.get('/users', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const safe = (db.users || []).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
  res.json(safe)
})

// Public company info & logo
router.get('/company', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`
  res.json({
    company: {
      name: 'Devonic Solutions',
      tagline: 'Your Vision, Our Solution',
      welcome: 'Hello 👋\nWelcome to Devonic Solutions! 🚀\nWe’re glad to connect with you.',
      message: 'Our team will contact you shortly. In the meantime, please share your requirements so we can assist you better. ✅',
      offerings: [
        { id: 'web-dev', emoji: '💻', title: 'Web Development', description: 'Modern, responsive web apps and websites.' },
        { id: 'graphic-design', emoji: '🎨', title: 'Graphic Designing', description: 'Branding, logos, marketing materials and UI design.' },
        { id: 'seo', emoji: '📈', title: 'SEO', description: 'Search engine optimization to increase visibility and traffic.' },
        { id: 'content-writing', emoji: '✍️', title: 'Content Writing', description: 'SEO-friendly content, blogs and copywriting.' },
        { id: 'digital-marketing', emoji: '📢', title: 'Digital Marketing', description: 'Ads, social media and growth strategies.' }
      ],
      note: 'This is our actual data for now; we will add further data later. These are our services; we will add more from the admin account later.',
      logoUrl: `${host}/api/auth/logo`
    }
  })
})

// Serve the logo file (place your image at c:\Users\DELL\Desktop\Devonic\server\public\logo.png)
router.get('/logo', (req, res) => {
  // prefer svg if present, else png
  const svgPath = path.join(__dirname, '..', 'public', 'logo.svg')
  const pngPath = path.join(__dirname, '..', 'public', 'logo.png')
  if (fs.existsSync(svgPath)) return res.sendFile(svgPath)
  if (fs.existsSync(pngPath)) return res.sendFile(pngPath)
  return res.status(404).json({
    error: 'Logo not found',
    message: 'Place your logo image at c:\\Users\\DELL\\Desktop\\Devonic\\server\\public\\logo.(svg|png)'
  })
})

module.exports = router
