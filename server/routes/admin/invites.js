const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { readDB, writeDB } = require('../../db')
const { verifyToken, requireRoles } = require('../../middleware/auth')

// All invite routes require admin (except accept which is public)
router.use('/accept', (req, res, next) => next()) // skip auth for accept

// GET /api/admin/invites - list all invites (admin only)
router.get('/', verifyToken, requireRoles('admin'), (req, res) => {
  const db = readDB()
  const invites = (db.invites || []).map(i => ({ ...i, token: undefined })) // hide token in list
  res.json(invites)
})

// POST /api/admin/invites - create invite (admin only)
router.post('/', verifyToken, requireRoles('admin'), (req, res) => {
  const db = readDB()
  if (!db.invites) db.invites = []

  const { email, role, expiresInDays } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })
  const normEmail = (email || '').toString().trim().toLowerCase()
  const targetRole = role || 'admin'
  if (!['admin', 'instructor'].includes(targetRole)) {
    return res.status(400).json({ error: 'Role must be admin or instructor' })
  }

  // check if invite already exists for this email
  const existing = db.invites.find(i => (i.email || '').toString().toLowerCase() === normEmail && i.status === 'pending')
  if (existing) return res.status(400).json({ error: 'Pending invite already exists for this email' })

  const token = crypto.randomBytes(32).toString('hex')
  const days = expiresInDays || 7
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

  const invite = {
    id: `invite-${Date.now()}`,
    email: normEmail,
    role: targetRole,
    token,
    status: 'pending',
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    expiresAt
  }

  db.invites.push(invite)
  writeDB(db)

  // In production, send email here. For now, return the token in response (dev only)
  const acceptUrl = `${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}/invite/accept?token=${token}`
  res.status(201).json({ ...invite, acceptUrl })
})

// DELETE /api/admin/invites/:id - revoke/delete invite (admin only)
router.delete('/:id', verifyToken, requireRoles('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.invites || []).findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Invite not found' })
  db.invites.splice(idx, 1)
  writeDB(db)
  res.json({ success: true })
})

// POST /api/admin/invites/accept - accept invite and create account (public)
router.post('/accept', async (req, res) => {
  const bcrypt = require('bcryptjs')
  const db = readDB()

  const { token, name, password } = req.body
  if (!token || !name || !password) {
    return res.status(400).json({ error: 'Token, name, and password are required' })
  }

  const invite = (db.invites || []).find(i => i.token === token && i.status === 'pending')
  if (!invite) return res.status(400).json({ error: 'Invalid or expired invite token' })

  // check expiry
  if (new Date(invite.expiresAt) < new Date()) {
    invite.status = 'expired'
    writeDB(db)
    return res.status(400).json({ error: 'Invite has expired' })
  }

  // check if user with this email already exists
  if (!db.users) db.users = []
  if (db.users.find(u => u.email === invite.email)) {
    return res.status(400).json({ error: 'User with this email already exists' })
  }

  // create user (normalize email)
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = {
    id: `${Date.now()}`,
    name,
    email: (invite.email || '').toString().toLowerCase(),
    password: hashedPassword,
    role: invite.role
  }
  db.users.push(user)

  // if instructor role, also create instructor profile linked to user
  if (invite.role === 'instructor') {
    if (!db.instructors) db.instructors = []
    const instructor = {
      id: `inst-${Date.now()}`,
      userId: user.id,
      name,
      email: invite.email,
      title: '',
      bio: '',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      skills: [],
      experience: [],
      projects: [],
      links: {},
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    db.instructors.push(instructor)
  }

  // mark invite as accepted
  invite.status = 'accepted'
  invite.acceptedAt = new Date().toISOString()
  // clear token to prevent reuse
  invite.token = null
  writeDB(db)

  res.json({ success: true, message: 'Account created successfully. You can now log in.' })
})

// GET /api/admin/invites/validate?token=xxx - validate invite token (public)
router.get('/validate', (req, res) => {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token is required' })

  const db = readDB()
  const invite = (db.invites || []).find(i => i.token === token && i.status === 'pending')
  if (!invite) return res.status(400).json({ valid: false, error: 'Invalid or expired invite token' })

  if (new Date(invite.expiresAt) < new Date()) {
    return res.status(400).json({ valid: false, error: 'Invite has expired' })
  }

  res.json({ valid: true, email: invite.email, role: invite.role })
})

module.exports = router
