const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

// List projects (public)
router.get('/', (req, res) => {
  const db = readDB()
  // return only active projects to public
  const projects = (db.projects || []).filter(p => p.status === 'active')
  res.json(projects)
})

// Get single project (admin)
router.get('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const p = (db.projects || []).find(x => x.id === req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

// Create project (admin). Optionally link to a request via requestId
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const { title, description, serviceId, price, ownerId, requestId } = req.body || {}
  if (!title || title.trim().length < 3) return res.status(400).json({ error: 'Invalid title' })

  const db = readDB()
  if (!db.projects) db.projects = []

  const project = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description || '',
    serviceId: serviceId || null,
    price: price !== undefined ? Number(price) : null,
    ownerId: ownerId || null,
    requestId: requestId || null,
    status: 'active',
    createdAt: new Date().toISOString()
  }

  db.projects.push(project)

  // if linked to a request, update request status
  if (requestId) {
    const idx = (db.requests || []).findIndex(r => r.id === requestId)
    if (idx !== -1) {
      db.requests[idx].status = 'converted'
      db.requests[idx].projectId = project.id
    }
  }

  writeDB(db)
  res.json(project)
})

// Update project (admin)
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.projects || []).findIndex(x => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const { title, description, price, status } = req.body || {}
  if (title) db.projects[idx].title = title
  if (description !== undefined) db.projects[idx].description = description
  if (price !== undefined) db.projects[idx].price = Number(price)
  if (status) db.projects[idx].status = status
  writeDB(db)
  res.json(db.projects[idx])
})

// Delete project (admin)
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.projects || []).findIndex(x => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const removed = db.projects.splice(idx, 1)[0]
  writeDB(db)
  res.json(removed)
})

module.exports = router
