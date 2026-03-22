const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

// GET /api/instructors - list all published instructors (public)
router.get('/', (req, res) => {
  const db = readDB()
  let instructors = db.instructors || []
  
  // Only return published instructors for public
  instructors = instructors.filter(i => i.status === 'published')
  
  // Optional search
  const q = req.query.q?.toLowerCase()
  if (q) {
    instructors = instructors.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.title?.toLowerCase().includes(q) ||
      i.skills?.some(s => s.toLowerCase().includes(q))
    )
  }
  
  // Include course count
  const courses = db.courses || []
  instructors = instructors.map(inst => ({
    ...inst,
    courseCount: courses.filter(c => c.instructorId === inst.id && c.published).length
  }))
  
  res.json(instructors)
})

// GET /api/instructors/:id - get instructor detail (public)
router.get('/:id', (req, res) => {
  const db = readDB()
  const instructor = (db.instructors || []).find(i => i.id === req.params.id)
  
  if (!instructor) {
    return res.status(404).json({ error: 'Instructor not found' })
  }
  
  // Include courses if requested
  if (req.query.include === 'courses') {
    instructor.courses = (db.courses || []).filter(
      c => c.instructorId === instructor.id && c.published
    )
  }
  
  res.json(instructor)
})

// POST /api/instructors - create instructor (admin only)
router.post('/', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  if (!db.instructors) db.instructors = []
  
  const { name, email, title, bio, avatarUrl, skills, experience, projects, links, status } = req.body
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }
  
  // Check duplicate email
  if (db.instructors.find(i => i.email === email)) {
    return res.status(400).json({ error: 'Instructor with this email already exists' })
  }
  
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

// PUT /api/instructors/:id - update instructor (admin only)
router.put('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.instructors || []).findIndex(i => i.id === req.params.id)
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Instructor not found' })
  }
  
  const { name, email, title, bio, avatarUrl, skills, experience, projects, links, status } = req.body
  
  // Check duplicate email (exclude current)
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

// DELETE /api/instructors/:id - delete instructor (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), (req, res) => {
  const db = readDB()
  const idx = (db.instructors || []).findIndex(i => i.id === req.params.id)
  
  if (idx === -1) {
    return res.status(404).json({ error: 'Instructor not found' })
  }
  
  // Check if instructor has courses
  const hasCourses = (db.courses || []).some(c => c.instructorId === req.params.id)
  if (hasCourses) {
    return res.status(400).json({ error: 'Cannot delete instructor with existing courses. Delete courses first.' })
  }
  
  db.instructors.splice(idx, 1)
  writeDB(db)
  
  res.json({ success: true })
})

module.exports = router
