const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../../db')
const { verifyToken, requireRoles } = require('../../middleware/auth')

// Protect all admin course routes
router.use(verifyToken, requireRoles('admin'))

// GET /api/admin/courses - list all courses (admin view)
router.get('/', (req, res) => {
  const db = readDB()
  let courses = db.courses || []
  // optional filter by instructorId, tag, q
  if (req.query.instructorId) courses = courses.filter(c => c.instructorId === req.query.instructorId)
  if (req.query.tag) {
    const tag = req.query.tag.toLowerCase()
    courses = courses.filter(c => c.tags?.some(t => t.toLowerCase() === tag))
  }
  const q = req.query.q?.toLowerCase()
  if (q) {
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.summary?.toLowerCase().includes(q) ||
      c.tags?.some(t => t.toLowerCase().includes(q))
    )
  }
  // attach instructor basic info
  const instructors = db.instructors || []
  courses = courses.map(course => ({ ...course, instructor: instructors.find(i => i.id === course.instructorId) || null }))
  res.json(courses)
})

// GET /api/admin/courses/:id - get course detail
router.get('/:id', (req, res) => {
  const db = readDB()
  const course = (db.courses || []).find(c => c.id === req.params.id)
  if (!course) return res.status(404).json({ error: 'Course not found' })
  const instructor = (db.instructors || []).find(i => i.id === course.instructorId) || null
  res.json({ ...course, instructor })
})

// POST /api/admin/courses - create course
router.post('/', (req, res) => {
  const db = readDB()
  if (!db.courses) db.courses = []

  const { title, summary, description, price, instructorId, duration, capacity, thumbnailUrl, tags, published } = req.body
  if (!title || !instructorId) return res.status(400).json({ error: 'Title and instructorId are required' })

  if (!(db.instructors || []).find(i => i.id === instructorId)) {
    return res.status(400).json({ error: 'Instructor not found' })
  }

  const course = {
    id: `course-${Date.now()}`,
    title,
    summary: summary || '',
    description: description || '',
    price: price || 0,
    instructorId,
    duration: duration || '',
    capacity: capacity || null,
    students: [],
    thumbnailUrl: thumbnailUrl || '',
    tags: tags || [],
    published: published !== false,
    createdAt: new Date().toISOString()
  }

  db.courses.push(course)
  writeDB(db)
  res.status(201).json(course)
})

// PUT /api/admin/courses/:id - update course
router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = (db.courses || []).findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Course not found' })

  const { title, summary, description, price, instructorId, duration, capacity, thumbnailUrl, tags, published } = req.body

  if (instructorId && !(db.instructors || []).find(i => i.id === instructorId)) {
    return res.status(400).json({ error: 'Instructor not found' })
  }

  db.courses[idx] = {
    ...db.courses[idx],
    title: title ?? db.courses[idx].title,
    summary: summary ?? db.courses[idx].summary,
    description: description ?? db.courses[idx].description,
    price: price ?? db.courses[idx].price,
    instructorId: instructorId ?? db.courses[idx].instructorId,
    duration: duration ?? db.courses[idx].duration,
    capacity: capacity ?? db.courses[idx].capacity,
    thumbnailUrl: thumbnailUrl ?? db.courses[idx].thumbnailUrl,
    tags: tags ?? db.courses[idx].tags,
    published: published ?? db.courses[idx].published,
    updatedAt: new Date().toISOString()
  }

  writeDB(db)
  res.json(db.courses[idx])
})

// DELETE /api/admin/courses/:id - delete course
router.delete('/:id', (req, res) => {
  const db = readDB()
  const idx = (db.courses || []).findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Course not found' })
  db.courses.splice(idx, 1)
  writeDB(db)
  res.json({ success: true })
})

// PATCH /api/admin/courses/:id/publish - set published true/false
router.patch('/:id/publish', (req, res) => {
  const db = readDB()
  const idx = (db.courses || []).findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Course not found' })
  const { published } = req.body
  if (typeof published !== 'boolean') return res.status(400).json({ error: 'published must be boolean' })
  db.courses[idx].published = published
  db.courses[idx].updatedAt = new Date().toISOString()
  writeDB(db)
  res.json(db.courses[idx])
})

module.exports = router
