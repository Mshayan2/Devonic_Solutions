import React from 'react'

export default function Skeleton({ className = 'h-24 rounded bg-gray-200 animate-pulse' }){
  return <div className={className} aria-hidden="true" />
}
