import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import Icon from '../components/Icon/Icon'
import { toast } from 'react-hot-toast'

export default function AcceptInvite() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [inviteInfo, setInviteInfo] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No invite token provided')
      setValidating(false)
      return
    }
    api.validateInvite(token)
      .then(data => {
        if (data.valid) {
          setInviteInfo(data)
        } else {
          setError(data.error || 'Invalid invite')
        }
      })
      .catch(err => setError(err.message || 'Invalid or expired invite'))
      .finally(() => setValidating(false))
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSubmitting(true)
    try {
      await api.acceptInvite({ token, name: form.name, password: form.password })
      toast.success('Account created! You can now log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Error accepting invite')
    } finally {
      setSubmitting(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-brand mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">Validating your invite...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alert" className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid Invite</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>Go to Homepage</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="send" className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            You've been invited to join as{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand capitalize">
              {inviteInfo.role}
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{inviteInfo.email}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput label="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" required />
          <FormInput label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" required />
          <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter your password" required />
          <Button type="submit" className="w-full" loading={submitting}>
            <Icon name="check" className="w-4 h-4 mr-2" />Create Account
          </Button>
        </form>
      </div>
    </div>
  )
}
