import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon/Icon'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard(){
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    services: 0,
    users: 0,
    courses: 0,
    instructors: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const [services, users, courses, instructors] = await Promise.all([
          api.listServices().catch(() => []),
          api.listUsers().catch(() => []),
          api.adminListCourses().catch(() => []),
          api.listInstructors().catch(() => [])
        ])

        if (!mounted) return

        setStats({
          services: Array.isArray(services) ? services.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          courses: Array.isArray(courses) ? courses.length : 0,
          instructors: Array.isArray(instructors) ? instructors.length : 0
        })

      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-contrast tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage requests, services, users, and homepage content.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/admin/services" className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
            <Icon name="activity" size={18} />
            Services
          </a>
          {/* Requests removed — handled via WhatsApp now */}
          <a href="/admin/courses" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-contrast hover:bg-gray-50 transition-all shadow-sm">
            <Icon name="layers" size={18} />
            Courses
          </a>
          <a href="/admin/instructors" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-contrast hover:bg-gray-50 transition-all shadow-sm">
            <Icon name="users" size={18} />
            Instructors
          </a>
          <a href="/admin/invites" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-contrast hover:bg-gray-50 transition-all shadow-sm">
            <Icon name="mail" size={18} />
            Invites
          </a>
          <a href="/admin/content" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-contrast hover:bg-gray-50 transition-all shadow-sm">

            <Icon name="settings" size={18} />
            Homepage
          </a>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Services', value: stats.services, icon: 'layers', color: 'brand', link: '/admin/services' },
          { label: 'Users', value: stats.users, icon: 'users', color: 'green', link: '#' },
          { label: 'Courses', value: stats.courses, icon: 'activity', color: 'pink', link: '/admin/courses' },
          { label: 'Instructors', value: stats.instructors, icon: 'users', color: 'purple', link: '/admin/instructors' }
        ].map((stat) => (

          <Link 
            key={stat.label} 
            to={stat.link}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                stat.color === 'brand' ? 'bg-brand/10 text-brand' :
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-pink-100 text-pink-600'
              }`}>
                <Icon name={stat.icon} size={16} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-black text-brand-contrast mt-0.5 group-hover:text-brand transition-colors">
              {loading ? '—' : stat.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
