import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Skeleton from '../components/ui/Skeleton'
import Icon from '../components/Icon/Icon'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollForm, setEnrollForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    loadCourse()
  }, [id])

  async function loadCourse() {
    try {
      setLoading(true)
      const data = await api.getCourse(id)
      setCourse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll(e) {
    e.preventDefault()
    try {
      setEnrolling(true)
      await api.enrollCourse(id, {
        name: user?.name || enrollForm.name,
        email: user?.email || enrollForm.email,
        userId: user?.id || null,
        message: enrollForm.message
      })
      toast.success('Enrollment request submitted successfully!')
      setShowEnrollModal(false)
      setEnrollForm({ name: '', email: '', message: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to submit enrollment')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-contrast py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-64 rounded-2xl mb-8" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-brand-contrast flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Course not found'}</p>
          <Link to="/courses" className="text-brand hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-contrast">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-brand/5 to-transparent">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <Icon name="arrow-left" size={20} className="mr-2" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Thumbnail */}
              {course.thumbnailUrl && (
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              {course.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 bg-brand/10 text-brand rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              <p className="text-gray-400 text-lg mb-8">
                {course.summary}
              </p>

              {/* Description */}
              {course.description && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-semibold text-white mb-4">About This Course</h2>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {course.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-6 sticky top-24">
                  <div className="text-center mb-6">
                    {course.duration && (
                      <p className="text-gray-400">{course.duration}</p>
                    )}
                  </div>

                {/* WhatsApp-first CTA (replaces Enroll Now) */}
                {(() => {
                  const waNumber = '923141707750'
                  const text = encodeURIComponent(`Hi, I'm interested in the ${course.title} course. Please share enrollment details.`)
                  const waLink = `https://wa.me/${waNumber}?text=${text}`
                  return (
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full inline-block mb-4">
                      <button className="w-full bg-brand hover:bg-brand/90 text-brand-contrast font-bold py-4 px-6 rounded-xl transition-colors">
                        Chat on WhatsApp
                      </button>
                    </a>
                  )
                })()}

                {/* Details */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {course.capacity && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Capacity</span>
                      <span className="text-white">{course.capacity} students</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{course.duration || 'Self-paced'}</span>
                  </div>
                </div>

                {/* Instructor removed from UI */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enroll Modal */}
      <Modal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        title={`Enroll in ${course.title}`}
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={enrollForm.name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={enrollForm.email}
                  onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand/50"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message (Optional)
            </label>
            <textarea
              rows={3}
              value={enrollForm.message}
              onChange={(e) => setEnrollForm({ ...enrollForm, message: e.target.value })}
              placeholder="Any questions or requirements?"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand/50"
            />
          </div>
          <button
            type="submit"
            disabled={enrolling}
            className="w-full bg-brand hover:bg-brand/90 text-brand-contrast font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {enrolling ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : 'Submit Enrollment Request'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
