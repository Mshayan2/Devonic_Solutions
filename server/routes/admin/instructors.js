const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../../db')
const { verifyToken, requireRoles } = require('../../middleware/auth')

// All admin instructor routes require authentication and admin role
router.use(verifyToken, requireRoles('admin'))

// GET /api/admin/instructors - list all instructors (including drafts)
router.get('/', (req, res) => {
  const db = readDB()
  const instructors = db.instructors || []
  res.json(instructors)
})

// GET /api/admin/instructors/:id - get instructor detail
router.get('/:id', (req, res) => {
  const db = readDB()
  const instructor = (db.instructors || []).find(i => i.id === req.params.id)
  if (!instructor) return res.status(404).json({ error: 'Instructor not found' })
  // include courses (all) for admin
  const courses = (db.courses || []).filter(c => c.instructorId === instructor.id)
  res.json({ ...instructor, courses })
})

// POST /api/admin/instructors - create instructor
router.post('/', (req, res) => {
  const db = readDB()
  if (!db.instructors) db.instructors = []

  const { name, email, title, bio, avatarUrl, skills, experience, projects, links, status } = req.body

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' })
  if (db.instructors.find(i => i.email === email)) return res.status(400).json({ error: 'Instructor with this email already exists' })

  const instructor = {
    id: `inst-${Date.now()}`,
    userId: null,
    name,
    email,
    title: title || '',
    bio: bio || '',
    avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
    skills: skills || [],
    experience: experience || [],
    projects: projects || [],
    links: links || {},
    status: status || 'published',
    createdAt: new Date().toISOString()
  }

  db.instructors.push(instructor)
  writeDB(db)

  res.status(201).json(instructor)
})

// PUT /api/admin/instructors/:id - update instructor
router.put('/:id', (req, res) => {
  const db = readDB()
  const idx = (db.instructors || []).findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Instructor not found' })

  const { name, email, title, bio, avatarUrl, skills, experience, projects, links, status } = req.body

  if (email && db.instructors.find(i => i.email === email && i.id !== req.params.id)) {
    return res.status(400).json({ error: 'Another instructor with this email already exists' })
  }

  db.instructors[idx] = {
    ...db.instructors[idx],
    name: name ?? db.instructors[idx].name,
    email: email ?? db.instructors[idx].email,
    title: title ?? db.instructors[idx].title,
    bio: bio ?? db.instructors[idx].bio,
    avatarUrl: avatarUrl ?? db.instructors[idx].avatarUrl,
    skills: skills ?? db.instructors[idx].skills,
    experience: experience ?? db.instructors[idx].experience,
    projects: projects ?? db.instructors[idx].projects,
    links: links ?? db.instructors[idx].links,
    status: status ?? db.instructors[idx].status,
    updatedAt: new Date().toISOString()
  }

  writeDB(db)
  res.json(db.instructors[idx])
})

// DELETE /api/admin/instructors/:id - delete instructor (only if no courses)
router.delete('/:id', (req, res) => {
  const db = readDB()
  const idx = (db.instructors || []).findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Instructor not found' })

  const hasCourses = (db.courses || []).some(c => c.instructorId === req.params.id)
  if (hasCourses) return res.status(400).json({ error: 'Cannot delete instructor with existing courses. Delete or reassign courses first.' })

  db.instructors.splice(idx, 1)
  writeDB(db)
  res.json({ success: true })
})

// PATCH /api/admin/instructors/:id/status - set status (published|draft)
router.patch('/:id/status', (req, res) => {
  const db = readDB()
  const idx = (db.instructors || []).findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Instructor not found' })

  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Missing status' })
  db.instructors[idx].status = status
  db.instructors[idx].updatedAt = new Date().toISOString()
  writeDB(db)
  res.json(db.instructors[idx])
})

module.exports = router
