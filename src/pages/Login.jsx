import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon/Icon'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    // client-side validation
    const errs = {}
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Please enter a valid email'
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    login({ email, password })
      .then((u) => {
        toast.success(`Access Granted: Welcome back, ${u.name}`)
        // Redirect by role
        if (u?.role === 'admin') navigate('/admin')
        else navigate('/dashboard')
      })
      .catch((err) => {
        setErrors({ form: err.message || 'Verification failed' })
        toast.error(err.message || 'Verification Failed: Check credentials')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="bg-brand-contrast p-10 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mx-auto mb-6 scale-110">
            <Icon name="security" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Access</h1>
          <p className="text-gray-500 mt-2 font-medium">Initialize your secure session.</p>
        </div>

        <form onSubmit={submit} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] ml-1">Identity Protocol (Email)</label>
            <input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
              placeholder="operator@devonic.io"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:ring-2 focus:ring-brand outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p id="email-error" className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Passkey</label>
              <button type="button" className="text-[10px] font-bold text-brand uppercase tracking-widest hover:opacity-80">Recover</button>
            </div>
            <input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:ring-2 focus:ring-brand outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p id="password-error" className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-[#ff9d26] text-brand-contrast font-black py-5 rounded-2xl shadow-xl shadow-brand/20 transition-all transform active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AUTHORIZING...
              </>
            ) : (
              <>
                AUTHORIZE
                <Icon name="arrow-right" size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          {errors.form && <p className="text-sm text-red-500 mb-3">{errors.form}</p>}
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            New to Devonic?
            <Link to="/signup" className="ml-2 text-brand hover:text-white transition-colors">Create Profile</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
