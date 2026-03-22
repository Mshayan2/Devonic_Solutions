import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">404 — Not Found</h1>
      <p className="text-gray-600 mb-4">The page you requested could not be found.</p>
      <Link to="/" className="text-brand font-medium">Go home</Link>
    </div>
  )
}
