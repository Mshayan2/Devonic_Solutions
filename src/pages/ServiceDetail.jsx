import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Icon from '../components/Icon/Icon'
import Button from '../components/ui/Button'
import { toast } from 'react-hot-toast'

export default function ServiceDetail(){
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    api.getService(id).then((s) => {
      if (!mounted) return
      setService(s)
      setLoading(false)
    }).catch(() => {
      if (!mounted) return
      setService(null)
      setLoading(false)
    })
    return () => (mounted = false)
  }, [id])

  if (loading) return (
    <div className="py-20 text-center">
      <div className="h-10 w-10 mx-auto mb-6 rounded-full bg-white/5 animate-pulse" />
      <p className="text-gray-500">Loading service...</p>
    </div>
  )

  if(!service) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold">Service not found</h2>
      <Link to="/services" className="text-brand mt-4 inline-block">Back to services</Link>
    </div>
  )

  return (
    <>
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Hero image: try local hero files, then thumbnail, then Unsplash, then placeholder */}
        {(() => {
          const idKey = (service.id || '').toString()
          const titleKey = (service.title || '').toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
          const localCandidates = [
            `/assets/services/${idKey}-hero.webp`,
            `/assets/services/${idKey}-hero.jpg`,
            `/assets/services/${idKey}-hero.png`,
            `/assets/services/${idKey}.webp`,
            `/assets/services/${idKey}.jpg`,
            `/assets/services/${idKey}.png`
          ]
          if (titleKey) {
            localCandidates.push(`/assets/services/${titleKey}-hero.jpg`, `/assets/services/${titleKey}.jpg`)
          }
          const keyword = encodeURIComponent(service.title?.split(' ')[0] || 'business')
          const all = localCandidates.concat(service.thumbnailUrl ? [service.thumbnailUrl] : []).concat([`https://source.unsplash.com/1600x900/?${keyword}`])
          const placeholder = `/assets/services/placeholder1.svg`

          return (
            <>
              <img
                src={all[0]}
                data-idx="0"
                alt={service.title}
                className="w-full h-56 md:h-72 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  let idx = Number(e.currentTarget.getAttribute('data-idx') || 0)
                  idx = idx + 1
                  const next = all[idx]
                  e.currentTarget.setAttribute('data-idx', String(idx))
                  if (next) {
                    e.currentTarget.src = next
                    e.currentTarget.onerror = (ev) => { ev.currentTarget.onerror = null; ev.currentTarget.src = placeholder }
                  } else {
                    e.currentTarget.src = placeholder
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute left-6 bottom-6 text-white z-20">
                <Link to="/services" className="text-sm text-white/80 hover:text-white transition-colors">Services</Link>
                <h1 className="text-3xl md:text-4xl font-bold mt-2">{service.title}</h1>
                <p className="text-sm text-white/80 mt-1 max-w-2xl">{service.summary}</p>
              </div>
            </>
          )
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <header className="flex items-center gap-6">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white/5 rounded-lg text-brand">
              <Icon name={service.iconName} size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{service.title}</h1>
              <p className="text-gray-400 text-sm">{service.summary}</p>
            </div>
          </header>

          {/* Minimal description (kept intentionally short) */}
          <div className="prose prose-invert text-gray-300">
            <p>{(service.description || service.summary || '').split('\n').slice(0,2).join(' ')}</p>
          </div>
          {/* content continues below */}

        </div>

        <aside className="space-y-8">
          <div className="bg-gradient-to-br from-brand-contrast to-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-brand/20 overflow-hidden sticky top-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[40px]" />
            <h3 className="text-lg font-semibold mb-2">Get a tailored quote</h3>
            <p className="text-white/75 text-sm mb-4">Discuss scope and timelines via WhatsApp for a fast, tailored response.</p>

            {(() => {
              const waNumber = '923141707750'
              const text = encodeURIComponent(`Hi, I'm interested in ${service.title}. Please share scope and pricing options.`)
              const waLink = `https://wa.me/${waNumber}?text=${text}`
              return (
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full inline-block">
                  <Button className="w-full mb-3 bg-brand hover:bg-brand/90 text-white" size="lg">
                    <Icon name="message-circle" size={16} className="mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>
              )
            })()}

            {/* Send Request removed — customers should contact via WhatsApp */}

            <div className="mt-6 text-center text-xs text-white/40">Typical reply time: within 24 hours. WhatsApp is fastest.</div>
          </div>
        </aside>
      </div>
    </div>
    </>
  )
}
