const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

// GET /api/courses - list all published courses (public)
router.get('/', (req, res) => {
  const db = readDB()
  let courses = db.courses || []
  
  // Only return published courses for public
  if (!req.query.all) {
    courses = courses.filter(c => c.published)
  }
  
  // Filter by instructor
  if (req.query.instructorId) {
    courses = courses.filter(c => c.instructorId === req.query.instructorId)
  }
  
  // Filter by tag
  if (req.query.tag) {
    const tag = req.query.tag.toLowerCase()
    courses = courses.filter(c => c.tags?.some(t => t.toLowerCase() === tag))
  }
  
  // Search
  const q = req.query.q?.toLowerCase()
  if (q) {
    courses = courses.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.summary?.toLowerCase().includes(q) ||
      c.tags?.some(t => t.toLowerCase().includes(q))
    )
  }
  
  // Include instructor info
  const instructors = db.instructors || []
  courses = courses.map(course => ({
    ...course,
    instructor: instructors.find(i => i.id === course.instructorId) || null
  }))
  
  res.json(courses)
})

// GET /api/courses/:id - get course detail (public)
router.get('/:id', (req, res) => {
  const db = readDB()
  const course = (db.courses || []).find(c => c.id === req.params.id)
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }
  
  // Include instructor details
  if (req.query.include === 'instructor') {
    course.instructor = (db.instructors || []).find(i => i.id === course.instructorId) || null
  }
  
  res.json(course)
})

// POST /api/courses - create course (admin only)
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  if (!db.courses) db.courses = []
  
  const { title, summary, description, price, instructorId, duration, capacity, thumbnailUrl, tags, published } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }
  
  const course = {
    id: `course-${Date.now()}`,
    title,
    summary: summary || '',
    description: description || '',
    price: price || 0,
    instructorId: instructorId || null,
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

// PUT /api/courses/:id - update course (admin only)
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.courses || []).findIndex(c => c.id === req.params.id)
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Course not found' })
  }
  
  const { title, summary, description, price, instructorId, duration, capacity, thumbnailUrl, tags, published } = req.body
  
  // instructorId is optional; do not enforce instructor existence here
  
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

// DELETE /api/courses/:id - delete course (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.courses || []).findIndex(c => c.id === req.params.id)
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Course not found' })
  }
  
  db.courses.splice(idx, 1)
  writeDB(db)
  
  res.json({ success: true })
})

// POST /api/courses/:id/enroll - enroll in course (creates a request)
router.post('/:id/enroll', (req, res) => {
  const db = readDB()
  const course = (db.courses || []).find(c => c.id === req.params.id)
  
  if (!course) {
    return res.status(404).json({ error: 'Course not found' })
  }
  
  if (!db.requests) db.requests = []
  
  const { name, email, message, userId } = req.body
  
  if (!email && !userId) {
    return res.status(400).json({ error: 'Email or userId is required' })
  }
  
  const enrollmentRequest = {
    id: `${Date.now()}`,
    type: 'enrollment',
    courseId: course.id,
    courseTitle: course.title,
    name: name || '',
    email: email || '',
    userId: userId || null,
    message: message || '',
    status: 'new',
    createdAt: new Date().toISOString()
  }
  
  db.requests.push(enrollmentRequest)
  writeDB(db)
  
  res.status(201).json({ success: true, message: 'Enrollment request submitted successfully', request: enrollmentRequest })
})

module.exports = router
