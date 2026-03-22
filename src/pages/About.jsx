import React from 'react'
import Icon from '../components/Icon/Icon'

export default function About() {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden rounded-[3rem] bg-brand-contrast">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand/20 blur-[120px] rounded-full"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand text-xs font-bold uppercase tracking-widest">
            Since 2024
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Engineering the <span className="text-brand">Future</span> of Digital Experience.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Devonic Solutions is a collective of visionary engineers and designers 
            dedicated to crafting products that define industries.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight">
            A philosophy rooted in <br />
            <span className="text-gray-500">technical excellence.</span>
          </h2>
          <div className="space-y-6">
            <p className="text-gray-400 text-lg leading-relaxed">
              We don't believe in "good enough." Every project at Devonic is an opportunity to push 
              the boundaries of what's possible with modern architecture.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-3xl font-bold text-brand mb-1">99.9%</div>
                <div className="text-gray-500 text-sm font-bold uppercase">Uptime Architecture</div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-3xl font-bold text-brand mb-1">15+</div>
                <div className="text-gray-500 text-sm font-bold uppercase">Tech Stacks</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full md:w-[520px] rounded-[2.5rem] bg-gradient-to-br from-white/3 to-white/2 border border-white/6 p-8 overflow-hidden shadow-lg">
          <div className="absolute top-6 left-6 flex gap-2 z-10">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-[260px]">
            <pre className="m-0 font-mono text-sm text-brand leading-snug bg-transparent">{`const innovations = [
  "Cloud Native",
  "Edge Computing",
  "AI Integration"
];

// Bridging vision & tech`}</pre>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="110" cy="110" r="110" fill="url(#g)" />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#FF8A00" stopOpacity="0.08" />
                  <stop offset="1" stopColor="#FF3D00" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Our Core Commitments</h2>
          <div className="w-24 h-1 bg-brand mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Excellence', icon: 'activity', text: 'We don\'t just ship code; we deliver high-performance solutions optimized for scale.' },
            { title: 'Security', icon: 'security', text: 'Military-grade encryption and security-first development practices by default.' },
            { title: 'Evolution', icon: 'zap', text: 'Staying ahead of the curve by leveraging the latest stable technologies and methodologies.' }
          ].map((v, i) => (
            <div key={i} className="p-10 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2.5rem] transition-all group">
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-8 group-hover:scale-110 transition-transform">
                <Icon name={v.icon} size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{v.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
