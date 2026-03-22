const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { readDB } = require('../db')

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

// Get JWT secret with validation
let JWT_SECRET

if (isProduction) {
  JWT_SECRET = validateSecret(
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    'JWT_ACCESS_SECRET or JWT_SECRET'
  )
} else {
  // Development: use env vars if provided and valid, otherwise generate secure random secret
  const devSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  
  JWT_SECRET = devSecret && devSecret.length >= 32 
    ? devSecret 
    : generateDevSecret()
    
  if (!devSecret || devSecret.length < 32) {
    console.warn('[AUTH] Using auto-generated secure JWT secret for development')
  }
}


function verifyToken(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Missing authorization' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'Bad authorization format' })
  const token = parts[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (req.user.role !== role) return res.status(403).json({ error: 'Insufficient role' })
    next()
  }
}

// Allow multiple roles
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient role' })
    next()
  }
}

module.exports = { verifyToken, requireRole, requireRoles }
