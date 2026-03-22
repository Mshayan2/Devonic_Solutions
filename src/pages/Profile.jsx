import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon/Icon'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const { user, isAdmin } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  // requests removed — handled via WhatsApp

  // Simplified formatting for roles
  const roleDisplay = isAdmin?.() ? 'Administrator' : 'Client Account'
  const accountId = 'DEV-' + (user?.email?.split('@')[0]?.toUpperCase() || 'USER')

  // Profile editing removed — use Settings to change password and contact prefs

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      toast.success('Password update feature coming soon!')
      setShowPasswordModal(false)
      setPasswordForm({ current: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-brand-contrast p-8 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'Devonic User'}</h1>
          <p className="text-gray-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
            <Icon name="mail" size={16} />
            {user?.email}
          </p>
          <p className="text-gray-400 font-medium mb-2 flex items-center justify-center md:justify-start gap-2">
            <Icon name="phone" size={16} />
            {user?.whatsapp || 'Not provided'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPasswordModal(true)} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all font-semibold px-6">
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar: only password card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Icon name="security" size={18} className="text-brand" />
              Password
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Password</span>
                <span className="text-emerald-500 font-bold">Hidden</span>
              </div>
              <button onClick={() => setShowPasswordModal(true)} className="w-full mt-2 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Full Name</label>
                <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Address</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">WhatsApp</label>
                <p className="text-white font-medium">{user?.whatsapp || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gmail</label>
                <p className="text-white font-medium">{user?.gmail || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-6">
              <a href={`https://wa.me/923141707750?text=${encodeURIComponent("Hi, I'd like to discuss a project.")}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition-all">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile removed */}

      {/* Password Modal */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Update Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input 
              type="password" 
              value={passwordForm.current} 
              onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input 
              type="password" 
              value={passwordForm.newPassword} 
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              value={passwordForm.confirm} 
              onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
