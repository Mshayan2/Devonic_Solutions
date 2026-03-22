const express = require('express')
const router = express.Router()
const { readDB, writeDB } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')

// Public: get homepage content
router.get('/home', (req, res) => {
  const db = readDB()
  const home = db.content?.home || {}
  res.json(home)
})

// Admin: update homepage content
router.put('/home', verifyToken, requireRole('admin'), (req, res) => {
  const { hero, highlights, cta } = req.body || {}
  if (!hero || !hero.title || !hero.subtitle) {
    return res.status(400).json({ error: 'Hero title and subtitle are required' })
  }
  const normalized = {
    hero: {
      title: String(hero.title || '').trim(),
      subtitle: String(hero.subtitle || '').trim(),
      primaryCta: hero.primaryCta || { label: 'Browse Services', href: '/services' },
      secondaryCta: hero.secondaryCta || { label: 'Request a Project', href: '/contact' }
    },
    highlights: Array.isArray(highlights) ? highlights.map((h, idx) => ({
      id: h.id || `hl-${idx + 1}`,
      title: String(h.title || '').trim(),
      body: String(h.body || '').trim(),
      iconName: h.iconName || 'check'
    })) : [],
    cta: {
      title: String(cta?.title || '').trim(),
      subtitle: String(cta?.subtitle || '').trim(),
      primaryCta: cta?.primaryCta || { label: 'Start a Request', href: '/contact' }
    }
  }

  const db = readDB()
  if (!db.content) db.content = {}
  db.content.home = normalized
  writeDB(db)
  res.json(db.content.home)
})

module.exports = router
