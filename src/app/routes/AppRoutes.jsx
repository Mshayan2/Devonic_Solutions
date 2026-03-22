import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'

import Home from '../../pages/Home'
import Services from '../../pages/Services'
import ServiceDetail from '../../pages/ServiceDetail'
import About from '../../pages/About'
import Contact from '../../pages/Contact'
import Login from '../../pages/Login'
import Signup from '../../pages/Signup'
import Dashboard from '../../pages/Dashboard'
import AdminDashboard from '../../pages/AdminDashboard'
import AdminServices from '../../pages/AdminServices'
import AdminContent from '../../pages/AdminContent'
import AdminCourses from '../../pages/AdminCourses'
import AdminInvites from '../../pages/AdminInvites'
import AdminInstructors from '../../pages/AdminInstructors'
import AcceptInvite from '../../pages/AcceptInvite'
import Profile from '../../pages/Profile'
import NotFound from '../../pages/NotFound'
import Unauthorized from '../../pages/Unauthorized'
import Courses from '../../pages/Courses'
import CourseDetail from '../../pages/CourseDetail'
import Instructors from '../../pages/Instructors'
import InstructorDetail from '../../pages/InstructorDetail'


export default function AppRoutes(){
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/instructors/:id" element={<InstructorDetail />} />
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/invite/accept" element={<AcceptInvite />} />
      </Route>

      {/* protected routes (use PublicLayout so nav/footer are visible) */}
      <Route element={<PublicLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* admin-only */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute requiredRole="admin"><AdminContent /></ProtectedRoute>} />
        {/* requests route removed — requests are handled via WhatsApp */}
        
        <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/instructors" element={<ProtectedRoute requiredRole="admin"><AdminInstructors /></ProtectedRoute>} />
        <Route path="/admin/invites" element={<ProtectedRoute requiredRole="admin"><AdminInvites /></ProtectedRoute>} />

      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
