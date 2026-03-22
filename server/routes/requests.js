const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'devonic_secret'

function getUserFromAuth(req) {
  const auth = req.headers.authorization
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length !== 2) return null
  try {
    return jwt.verify(parts[1], JWT_SECRET)
  } catch (e) {
    return null
  }
}

// Public: create request (contact or direct)
router.post('/', (req, res) => {
  const { name, email, message, serviceId, serviceTitle, source, gmail, whatsapp } = req.body || {}
  const user = getUserFromAuth(req)

  const resolvedName = (name || user?.name || '').toString().trim()
  const resolvedEmail = (email || user?.email || '').toString().trim()
  const resolvedMessage = (message || '').toString().trim()
  const resolvedGmail = (gmail || '').toString().trim()
  const resolvedWhatsapp = (whatsapp || '').toString().trim()

  if (!resolvedName || resolvedName.length < 2) return res.status(400).json({ error: 'Name is required' })
  if (!resolvedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resolvedEmail)) return res.status(400).json({ error: 'Valid email is required' })
  if (!resolvedMessage || resolvedMessage.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters' })

  const db = readDB()
  if (!db.requests) db.requests = []

  const request = {
    id: Date.now().toString(),
    name: resolvedName,
    email: resolvedEmail,
    gmail: resolvedGmail || null,
    whatsapp: resolvedWhatsapp || null,
    userId: user?.id || null,
    serviceId: serviceId || null,
    serviceTitle: serviceTitle || null,
    message: resolvedMessage,
    source: source || 'contact',
    status: 'new',
    createdAt: new Date().toISOString()
  }

  db.requests.unshift(request)
  writeDB(db)
  res.json(request)
})

// Admin: list all requests
router.get('/', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  res.json(db.requests || [])
})

// User: list own requests
router.get('/me', verifyToken, (req, res) => {
  const db = readDB()
  const list = (db.requests || []).filter(r => r.userId === req.user.id || r.email === req.user.email)
  res.json(list)
})

// Admin: update request status/notes
router.patch('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const { status, adminNote } = req.body || {}
  const db = readDB()
  const idx = (db.requests || []).findIndex(r => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  if (status) db.requests[idx].status = status
  if (adminNote !== undefined) db.requests[idx].adminNote = String(adminNote)
  writeDB(db)
  res.json(db.requests[idx])
})

module.exports = router
