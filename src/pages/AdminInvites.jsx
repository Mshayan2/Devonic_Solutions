import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Icon from '../components/Icon/Icon'
import Skeleton from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import { toast } from 'react-hot-toast'

export default function AdminInvites() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'admin', expiresInDays: 7 })
  const [saving, setSaving] = useState(false)
  const [lastInvite, setLastInvite] = useState(null)

  async function fetchInvites() {
    setLoading(true)
    try {
      const data = await api.adminListInvites()
      setInvites(data)
    } catch (err) {
      toast.error('Failed to load invites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInvites() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const result = await api.adminCreateInvite(form)
      setLastInvite(result)
      toast.success('Invite created')
      fetchInvites()
    } catch (err) {
      toast.error(err.message || 'Error creating invite')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Revoke this invite?')) return
    try {
      await api.adminDeleteInvite(id)
      toast.success('Invite revoked')
      fetchInvites()
    } catch (err) {
      toast.error(err.message || 'Error revoking invite')
    }
  }

  function copyLink() {
    if (lastInvite?.acceptUrl) {
      navigator.clipboard.writeText(lastInvite.acceptUrl)
      toast.success('Copied to clipboard')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invites</h1>
        <Button onClick={() => { setShowModal(true); setLastInvite(null) }}><Icon name="plus" className="w-4 h-4 mr-1" /> Create Invite</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : invites.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <Icon name="send" className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending invites</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Invite administrators to join the platform</p>
          <Button onClick={() => { setShowModal(true); setLastInvite(null) }}><Icon name="plus" className="w-4 h-4 mr-2" />Create Invite</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invites.map(inv => {
                const isExpired = new Date(inv.expiresAt) < new Date()
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                          <Icon name="mail" className="w-5 h-5 text-brand" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{inv.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full capitalize ${inv.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {inv.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                        inv.status === 'pending' && !isExpired ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        inv.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {isExpired && inv.status === 'pending' ? 'Expired' : inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status === 'pending' && !isExpired && (
                          <button 
                            onClick={() => handleDelete(inv.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Revoke Invite"
                          >
                            <Icon name="x" className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Invite">
        {lastInvite ? (
          <div className="space-y-5">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full">
              <Icon name="check" className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Invite Created!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share this link with the recipient</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite Link</label>
              <div className="flex items-center gap-2">
                <input readOnly value={lastInvite.acceptUrl} className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm dark:bg-gray-700 dark:text-white bg-gray-50" />
                <Button type="button" onClick={copyLink} variant="secondary">
                  <Icon name="copy" className="w-4 h-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <Icon name="clock" className="w-3 h-3 inline mr-1" />
              Expires: {new Date(lastInvite.expiresAt).toLocaleString()}
            </p>
            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-5">
            <FormInput label="Recipient Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" required />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin - Full management access</option>
              </select>
            </div>
            <FormInput label="Expires in (days)" type="number" min="1" value={form.expiresInDays} onChange={e => setForm({ ...form, expiresInDays: Number(e.target.value) })} />
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" loading={saving}>
                <Icon name="send" className="w-4 h-4 mr-2" />Create Invite
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
