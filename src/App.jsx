import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './app/routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#0b0b0b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
