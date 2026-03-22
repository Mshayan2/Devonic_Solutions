require('dotenv').config()
const express = require('express')
const Sentry = require('@sentry/node')
const promClient = require('prom-client')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/auth')
const servicesRoutes = require('./routes/services')
const contentRoutes = require('./routes/content')
const requestsRoutes = require('./routes/requests')
const projectsRoutes = require('./routes/projects')
const instructorsRoutes = require('./routes/instructors')
const coursesRoutes = require('./routes/courses')
const adminInstructorsRoutes = require('./routes/admin/instructors')
const adminCoursesRoutes = require('./routes/admin/courses')
const adminInvitesRoutes = require('./routes/admin/invites')
const path = require('path')
const { seed } = require('./seed')

const app = express()

// Automatic DB Seeding (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  try { seed() } catch (e) { console.warn('Seed failed:', e.message) }
}
// init Sentry if configured
if(process.env.SENTRY_DSN){
	Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV || 'development' })
	app.use(Sentry.Handlers.requestHandler())
}

app.use(helmet())
app.use(express.json())
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin }))

app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }))

// Stricter rate limiting for auth endpoints to prevent brute force
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

const registerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 registration attempts per 15 minutes
  message: { error: 'Too many registration attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

const refreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 refresh attempts per 15 minutes
  message: { error: 'Too many token refresh attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

// metrics

const register = promClient.register
promClient.collectDefaultMetrics({ timeout: 5000 })
app.get('/metrics', async (req, res) => {
	res.set('Content-Type', register.contentType)
	res.end(await register.metrics())
})

// Apply auth routes with specific rate limiting
app.use('/api/auth/login', authRateLimit)
app.use('/api/auth/register', registerRateLimit)
app.use('/api/auth/refresh', refreshRateLimit)
app.use('/api/auth', authRoutes)

app.use('/api/services', servicesRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/instructors', instructorsRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/admin/instructors', adminInstructorsRoutes)
app.use('/api/admin/courses', adminCoursesRoutes)
app.use('/api/admin/invites', adminInvitesRoutes)

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Sentry error handler (if enabled)
if(process.env.SENTRY_DSN){
	app.use(Sentry.Handlers.errorHandler())
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER_ERROR]', err)
  const status = err.status || 500
  res.status(status).json({
    error: true,
    message: err.message || 'Internal Server Error',
    code: err.code || 'UNKNOWN_ERROR'
  })
})

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log('Server running on', PORT))

// graceful shutdown
process.on('SIGINT', () => { console.log('Shutting down'); server.close(() => process.exit(0)) })
