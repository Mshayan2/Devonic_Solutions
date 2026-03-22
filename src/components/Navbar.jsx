import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon/Icon'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  function onLogout(){
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Courses', path: '/courses' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]


  if (user) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' })
    if (user.role === 'admin') navLinks.push({ name: 'Admin', path: '/admin' })
  }

  return (
    <nav className="bg-brand-contrast/95 text-white sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="flex items-center">
              <img src="/assets/Devonic-logo.png.jpg" alt="Devonic" title="Devonic" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8" role="menubar" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-brand ${location.pathname === link.path ? 'text-brand' : 'text-white/80'}`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button 
                onClick={onLogout} 
                className="text-sm font-semibold bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-semibold bg-brand hover:bg-brand/90 text-white px-4 py-2 rounded-lg transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu" 
              className="p-2 rounded-md text-white hover:bg-white/10"
            >
              {isOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-brand-contrast">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${location.pathname === link.path ? 'bg-brand/10 text-brand' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button 
                  onClick={onLogout} 
                  className="w-full text-center bg-brand text-white py-3 rounded-md font-bold"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-brand text-white py-3 rounded-md font-bold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
