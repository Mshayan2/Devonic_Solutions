const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

// List services (public)
router.get('/', (req, res) => {
  const db = readDB()
  res.json(db.services)
})

// Get single
router.get('/:id', (req, res) => {
  const db = readDB()
  const svc = db.services.find(s => s.id === req.params.id)
  if (!svc) return res.status(404).json({ error: 'Not found' })
  res.json(svc)
})

// Create (admin)
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const { title, summary, price, description, iconName } = req.body
  if (!title || typeof title !== 'string' || title.trim().length < 3) return res.status(400).json({ error: 'Invalid title' })
  if (!summary || typeof summary !== 'string' || summary.trim().length < 5) return res.status(400).json({ error: 'Invalid summary' })
  const p = Number(price)
  if (Number.isNaN(p) || p < 0) return res.status(400).json({ error: 'Invalid price' })

  const db = readDB()
  const svc = { id: Date.now().toString(), title: title.trim(), summary: summary.trim(), price: p, description: description || '', iconName: iconName || 'activity' }
  db.services.push(svc)
  writeDB(db)
  res.json(svc)
})

// Update (admin)
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = db.services.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const { title, summary, price, description, iconName } = req.body
  if (title && (typeof title !== 'string' || title.trim().length < 3)) return res.status(400).json({ error: 'Invalid title' })
  if (summary && (typeof summary !== 'string' || summary.trim().length < 5)) return res.status(400).json({ error: 'Invalid summary' })
  if (price !== undefined){
    const p = Number(price)
    if (Number.isNaN(p) || p < 0) return res.status(400).json({ error: 'Invalid price' })
    db.services[idx].price = p
  }
  if (title) db.services[idx].title = title.trim()
  if (summary) db.services[idx].summary = summary.trim()
  if (description !== undefined) db.services[idx].description = description
  if (iconName) db.services[idx].iconName = iconName
  writeDB(db)
  res.json(db.services[idx])
})

// Delete (admin)
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = db.services.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const removed = db.services.splice(idx, 1)[0]
  writeDB(db)
  res.json(removed)
})

module.exports = router
