import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function PublicLayout(){
  return (
    <div className="min-h-screen flex flex-col bg-brand-contrast text-white selection:bg-brand/30 selection:text-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
