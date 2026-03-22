import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ServiceCard from '../components/ServiceCard'
import Icon from '../components/Icon/Icon'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let mounted = true
    Promise.all([api.listServices(), api.getHomeContent(), api.listProjects()]).then(([services, home, projs]) => {
      if (!mounted) return
      setFeatured(Array.isArray(services) ? services.slice(0, 3) : [])
      setContent(home || null)
      setProjects(Array.isArray(projs) ? projs.slice(0, 3) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => (mounted = false)
  }, [])

  const hero = content?.hero || {}
  const highlights = Array.isArray(content?.highlights) ? content.highlights : []
  const cta = content?.cta || {}

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-10 pb-8">
        {/* Decorative background images */}
        <img src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1200&auto=format&fit=crop" alt="bg-1" className="pointer-events-none select-none absolute -left-24 -top-10 w-72 opacity-30 blur-lg transform -rotate-12" />
        <img src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" alt="bg-2" className="pointer-events-none select-none absolute -right-24 -top-6 w-80 opacity-25 blur-md transform rotate-6" />
        {/* User-provided hero image (local) with external fallback */}
        <img
          src="/assets/services/Gemini_Generated_Image_v4e68dv4e68dv4e6.png"
          alt="user-hero"
          className="pointer-events-none select-none absolute left-1/2 top-6 w-96 -translate-x-1/2 opacity-30 rounded-2xl object-cover shadow-2xl"
          onError={(e) => {
            // fallback to an online image if local file isn't present
            e.currentTarget.onerror = null
            e.currentTarget.src = 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop'
          }}
        />

        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              {hero.title || 'Learn digital skills, deliver real projects'}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {hero.subtitle || 'Short, practical services and guidance for teams and founders who want results fast.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={hero.primaryCta?.href || '/services'}
              className="px-8 py-4 bg-brand text-brand-contrast rounded-xl font-bold text-base transition-all hover:scale-105 shadow-lg shadow-brand/20"
            >
              {hero.primaryCta?.label || 'Browse Services'}
            </Link>
            <a href={`https://wa.me/923141707750?text=${encodeURIComponent('Hi, I would like to discuss a project.')}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-base transition-all">
              {hero.secondaryCta?.label || 'Chat on WhatsApp'}
            </a>
          </div>

          {/* Small services preview + view all button */}
          <div className="mt-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
                ))
              ) : (
                featured.map((s) => (
                  <div key={s.id} className="bg-transparent">
                    <ServiceCard service={s} />
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 text-center">
              <Link to="/services" className="px-6 py-2 bg-white/5 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all border border-white/5">
                View all services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Clients */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h3 className="text-2xl font-bold text-white">Trusted by teams worldwide</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">We help startups and enterprises ship products with confidence.</p>
        </div>

        {/* client logos removed as requested */}

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <Icon name="shield" size={28} className="mb-3 text-brand" />
            <h4 className="font-bold text-white">Secure & Reliable</h4>
            <p className="text-gray-400 text-sm">We follow best practices for security and reliability at every stage.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <Icon name="clock" size={28} className="mb-3 text-brand" />
            <h4 className="font-bold text-white">Delivered on time</h4>
            <p className="text-gray-400 text-sm">Predictable timelines and clear milestones so you can plan with confidence.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <Icon name="users" size={28} className="mb-3 text-brand" />
            <h4 className="font-bold text-white">Dedicated teams</h4>
            <p className="text-gray-400 text-sm">Senior engineers and designers paired to your project until launch.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white">How it works</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">A simple 3-step process to get your project started quickly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <div className="mx-auto w-20 h-20 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
              <Icon name="search" size={28} />
            </div>
            <h4 className="font-bold text-white mb-2">Tell us your needs</h4>
            <p className="text-gray-400 text-sm">Share your brief or book a chat — we’ll help scope the work.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <div className="mx-auto w-20 h-20 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
              <Icon name="clock" size={28} />
            </div>
            <h4 className="font-bold text-white mb-2">Plan & estimate</h4>
            <p className="text-gray-400 text-sm">We’ll propose a clear plan, timeline and price for approval.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl text-center">
            <div className="mx-auto w-20 h-20 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
              <Icon name="check" size={28} />
            </div>
            <h4 className="font-bold text-white mb-2">Deliver</h4>
            <p className="text-gray-400 text-sm">We deliver the project and provide support to launch smoothly.</p>
          </div>
        </div>
      </section>

      {/* Recent Projects removed per request */}

      {/* Featured Services removed from landing page */}

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div key={item.id} className="p-8 bg-white/5 rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-5">
                <Icon name={item.iconName || 'check'} size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>
      )}

      {/* Testimonials */}
      <section className="space-y-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white">What clients say</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Short testimonials from clients we worked with.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 bg-white/5 rounded-2xl">
            <p className="text-gray-300 italic">"Great to work with — delivered on time and helped us hit our launch goals."</p>
            <div className="mt-4 font-bold text-white">— Alice</div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl">
            <p className="text-gray-300 italic">"Clear communication and excellent output. Highly recommended."</p>
            <div className="mt-4 font-bold text-white">— Bob</div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl">
            <p className="text-gray-300 italic">"Simple process and great value for money. We’ll work with them again."</p>
            <div className="mt-4 font-bold text-white">— Rahman</div>
          </div>
        </div>
      </section>

      {/* High impact CTA */}
      <section className="relative py-16 px-6 bg-brand rounded-3xl overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-brand-contrast">
            {cta.title || 'Ready to start your project?'}
          </h2>
          <p className="text-brand-contrast/80 text-base font-medium">
            {cta.subtitle || 'Submit a request and we’ll reply within 24 hours.'}
          </p>
          <a
            href={`https://wa.me/923141707750?text=${encodeURIComponent('Hi, I would like to discuss a project.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-4 bg-brand-contrast text-white rounded-2xl font-bold text-base hover:scale-105 transition-all shadow-xl"
          >
            {cta.primaryCta?.label || 'Chat on WhatsApp'}
          </a>
        </div>
      </section>
    </div>
  )
}
