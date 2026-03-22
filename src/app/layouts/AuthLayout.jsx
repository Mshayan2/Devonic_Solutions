import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Icon from '../../components/Icon/Icon'

export default function AuthLayout(){
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-contrast p-6 selection:bg-brand/30">
      <div className="mb-10 animate-fade-in">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/Devonic-logo.png.jpg" alt="Devonic" className="w-16 h-16 object-contain" />
        </Link>
      </div>
      <div className="w-full max-w-lg mb-20 animate-slide-up">
        <Outlet />
      </div>
      
      <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} Devonic Solutions Engineering
      </div>
    </div>
  )
}
