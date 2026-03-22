import React from 'react'
import { Link } from 'react-router-dom'

export default function Unauthorized(){
  return (
    <div className="py-24 text-center">
      <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
      <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
      <Link to="/" className="text-brand font-bold">Return home</Link>
    </div>
  )
}
