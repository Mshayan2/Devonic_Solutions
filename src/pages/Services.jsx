import React, { useEffect, useState, useMemo } from 'react'
import ServiceCard from '../components/ServiceCard'
import Skeleton from '../components/ui/Skeleton'
import api from '../services/api'
import Icon from '../components/Icon/Icon'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured') // featured, name

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.listServices().then(data => {
      if (mounted) {
        // Deduplicate services by normalized title, prefer entries with a non-zero price
        const map = new Map()
        ;(Array.isArray(data) ? data : []).forEach(s => {
          const key = (s.title || '').toString().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
          const existing = map.get(key)
          if (!existing) {
            map.set(key, s)
          } else {
            // prefer the one with a price > 0
            if ((existing.price || 0) === 0 && (s.price || 0) > 0) {
              map.set(key, s)
            }
          }
        })
        setServices(Array.from(map.values()))
        setLoading(false)
      }
    })
    return () => mounted = false
  }, [])

  const filteredAndSortedServices = useMemo(() => {
    let result = [...services]

    // Filter
    if (searchTerm) {
      result = result.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title))

    return result
  }, [services, searchTerm, sortBy])

  return (
    <div className="space-y-12">
      {/* Header & Controls */}
      <div className="bg-brand-contrast p-10 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Engineering Catalog</h1>
          <p className="text-gray-400 font-medium">Select a core competency to initialize your deployment.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search solutions..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="relative w-full sm:w-56">
            <select
              className="w-full pl-6 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white appearance-none focus:ring-2 focus:ring-brand focus:border-transparent outline-none cursor-pointer font-bold"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option className="bg-brand-contrast" value="featured">Featured</option>
              <option className="bg-brand-contrast" value="name">Alphanumeric</option>
            </select>
            <Icon name="chevron-down" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 animate-pulse space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl" />
              <div className="h-6 bg-white/10 rounded-full w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded-full w-full" />
                <div className="h-4 bg-white/10 rounded-full w-5/6" />
              </div>
              <div className="h-10 bg-white/10 rounded-2xl w-full mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAndSortedServices.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      ) : (
        <div className="py-32 text-center bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-700">
            <Icon name="search" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Matrix search failed</h3>
          <p className="text-gray-500 max-w-sm mx-auto">No solutions matched your query. Perhaps we can build a custom one for you?</p>
          <button
            onClick={() => { setSearchTerm(''); setSortBy('featured') }}
            className="mt-8 px-8 py-3 bg-brand text-brand-contrast font-bold rounded-xl transition-all hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
