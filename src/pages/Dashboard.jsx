import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Icon from '../components/Icon/Icon'

export default function Dashboard() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api.listServices().then((svc) => {
      if (!mounted) return
      setServices(Array.isArray(svc) ? svc : [])
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const waNumber = '923141707750'
  const text = encodeURIComponent(`Hi, I'm interested in a project and would like to discuss.`)
  const waLink = `https://wa.me/${waNumber}?text=${text}`

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome, <span className="text-brand">{user?.name || 'Customer'}</span>
          </h1>
          <p className="text-gray-400 mt-2">Contact us via WhatsApp to start a project conversation.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/services" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10">
            <Icon name="layers" size={18} />
            Browse Services
          </Link>
          <Link to="/courses" className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all">
            <Icon name="activity" size={18} />
            View Courses
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-contrast rounded-3xl border border-white/5 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-6">Start a project conversation</h2>
          <p className="text-gray-400 mb-6">We handle all project enquiries via WhatsApp for a faster, direct response.</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block">
            <button className="px-8 py-4 bg-brand hover:bg-brand/90 text-brand-contrast rounded-2xl font-bold">Chat on WhatsApp</button>
          </a>
          <div className="mt-6 text-sm text-gray-400">
            <p>Your email: <span className="text-white font-medium">{user?.email || '—'}</span></p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <a href={`mailto:admin@devonic.local?subject=${encodeURIComponent('Project enquiry from ' + (user?.name || 'Customer'))}&body=${encodeURIComponent('Hello, I would like to discuss a project.\n\nUser: ' + (user?.name || '') + '\nEmail: ' + (user?.email || ''))}`} className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-white">Email us</a>
              <a href="/profile" className="text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-white">Update profile</a>
            </div>
          </div>
        </div>

        <div className="bg-brand-contrast rounded-3xl border border-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Icon name="folder" size={20} className="text-brand" />
            My dashboard
          </h2>
          <p className="text-gray-400">Use the dashboard to browse services and courses. Project requests are handled through WhatsApp.</p>
          <div className="mt-6 text-sm text-gray-400">
            <p className="mb-2">Quick links</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="inline-block bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-white">Browse services</Link>
              <Link to="/courses" className="inline-block bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-white">View courses</Link>
              <Link to="/profile" className="inline-block bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-white">Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
