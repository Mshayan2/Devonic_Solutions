// Use Vite dev server proxy by default in development. If you need a direct backend URL,
// set VITE_API_URL in your environment (e.g. .env.local).
const API_BASE = import.meta.env.VITE_API_URL || '/api'

import sentry from '../lib/sentry'
import { toast } from 'react-hot-toast'

// simple retry helper that offers a retry action via toast
function showRetryToast(message, retryFn){
  const id = toast.error(message, {
    duration: 8000,
    action: {
      text: 'Retry',
      onClick: () => {
        toast.dismiss(id)
        retryFn()
      }
    }
  })
}

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`

  // Inject Authorization header automatically when access token is available
  const token = typeof window !== 'undefined' ? localStorage.getItem('devonic_at') : null
  const headers = new Headers(opts.headers || {})
  if (token) headers.set('authorization', `Bearer ${token}`)
  if (!headers.has('content-type') && opts.body) headers.set('content-type', 'application/json')

  try{
    const res = await fetch(url, { ...opts, headers })
    const contentType = res.headers.get('content-type') || ''
    if(!res.ok){
      let body = null
      try{ body = contentType.includes('application/json') ? await res.json() : await res.text() }catch(e){}
      const err = new Error((body && body.message) ? body.message : `Request failed: ${res.status}`)
      err.status = res.status
      sentry.captureException(err)
      throw err
    }
    if (contentType.includes('application/json')) return res.json()
    return res.text()
  }catch(err){
    sentry.captureException(err)
    // show retry toast for network errors
    if (err.message && (err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
      showRetryToast('Network error — check your connection', () => request(path, opts))
    }
    throw err
  }
}

export default {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  refresh: (token) => request('/auth/refresh', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token }) }),
  me: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/me', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  listUsers: () => request('/auth/users'),

  // Services
  /* Services */
  listServices: () => request('/services'),
  getService: (id) => request(`/services/${id}`),
  createService: (payload) => request('/services', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  updateService: (id, payload) => request(`/services/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Content
  getHomeContent: () => request('/content/home'),
  updateHomeContent: (payload) => request('/content/home', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),

  // Requests
  createRequest: (payload) => request('/requests', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  listRequests: () => request('/requests'),
  listMyRequests: () => request('/requests/me'),
  updateRequest: (id, payload) => request(`/requests/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })

  ,
  // Projects
  listProjects: () => request('/projects'),
  createProject: (payload) => request('/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  getProject: (id) => request(`/projects/${id}`),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Instructors
  listInstructors: () => request('/instructors'),
  getInstructor: (id) => request(`/instructors/${id}`),

  // Courses

  listCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/courses${query ? `?${query}` : ''}`)
  },
  getCourse: (id, options = {}) => {
    const query = options.include ? `?include=${options.include}` : ''
    return request(`/courses/${id}${query}`)
  },
  createCourse: (payload) => request('/courses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  updateCourse: (id, payload) => request(`/courses/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
  enrollCourse: (id, payload) => request(`/courses/${id}/enroll`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),

  

  // Admin - Courses
  adminListCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/admin/courses${query ? `?${query}` : ''}`)
  },
  adminGetCourse: (id) => request(`/admin/courses/${id}`),
  adminCreateCourse: (payload) => request('/admin/courses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  adminUpdateCourse: (id, payload) => request(`/admin/courses/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  adminDeleteCourse: (id) => request(`/admin/courses/${id}`, { method: 'DELETE' }),
  adminPublishCourse: (id, published) => request(`/admin/courses/${id}/publish`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ published }) }),

  // Admin - Invites
  adminListInvites: () => request('/admin/invites'),
  adminCreateInvite: (payload) => request('/admin/invites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }),
  adminDeleteInvite: (id) => request(`/admin/invites/${id}`, { method: 'DELETE' }),
  validateInvite: (token) => request(`/admin/invites/validate?token=${encodeURIComponent(token)}`),
  acceptInvite: (payload) => request('/admin/invites/accept', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
}
