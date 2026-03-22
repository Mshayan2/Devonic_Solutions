import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// requiredRole: optional string like 'admin'
export default function ProtectedRoute({ children, requiredRole }){
  const { user, isAdmin } = useAuth()
  if(!user) return <Navigate to="/login" replace />
  if(requiredRole === 'admin' && !isAdmin()) return <Navigate to="/unauthorized" replace />
  return children
}
