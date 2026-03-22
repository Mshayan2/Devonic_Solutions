import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import api from '../services/api'

const AuthContext = createContext()

// Auth provider that uses backend JWT-based auth
export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('devonic_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) { return null }
  })
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('devonic_at') || null)
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('devonic_rt') || null)

  useEffect(() => {
    if (user) localStorage.setItem('devonic_user', JSON.stringify(user))
    else localStorage.removeItem('devonic_user')
  }, [user])

  useEffect(() => {
    if (accessToken) localStorage.setItem('devonic_at', accessToken)
    else localStorage.removeItem('devonic_at')
  }, [accessToken])

  useEffect(() => {
    if (refreshToken) localStorage.setItem('devonic_rt', refreshToken)
    else localStorage.removeItem('devonic_rt')
  }, [refreshToken])

  // attempt periodic refresh of access token using refresh token
  const refreshIntervalRef = useRef(null)
  useEffect(() => {
    // clear existing
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
    if (!refreshToken) return
    // attempt immediate refresh once on load
    let mounted = true
    api.refresh(refreshToken).then(res => {
      if (!mounted) return
      if (res && res.accessToken) setAccessToken(res.accessToken)
    }).catch(() => {
      // on refresh failure, clear tokens
      logout()
    })

    // schedule periodic refresh (every 10 minutes)
    refreshIntervalRef.current = setInterval(async () => {
      try{
        const res = await api.refresh(refreshToken)
        if (res && res.accessToken) setAccessToken(res.accessToken)
      }catch(e){
        logout()
      }
    }, 10 * 60 * 1000)

    return () => { mounted = false; if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current) }
  }, [refreshToken])

  async function login(payload) {
    // payload: { email, password }
    const res = await api.login(payload)
    if (res && res.accessToken) {
      setAccessToken(res.accessToken)
      setRefreshToken(res.refreshToken)
      setUser(res.user)
      return res.user
    }
    throw new Error(res?.error || 'Login failed')
  }

  async function signup(payload){
    const res = await api.register(payload)
    if (res && res.accessToken) {
      setAccessToken(res.accessToken)
      setRefreshToken(res.refreshToken)
      setUser(res.user)
      return res.user
    }
    throw new Error(res?.error || 'Signup failed')
  }

  async function updateProfile(payload){
    const res = await api.updateProfile(payload)
    if (res && res.user) {
      setUser(res.user)
      return res.user
    }
    throw new Error(res?.error || 'Failed to update profile')
  }

  function logout(){
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
  }

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, signup, logout, isAdmin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
