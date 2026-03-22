import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon/Icon'

export default function ServiceCard({ service }) {
  return (
    <article
      className="group bg-brand-contrast border border-white/5 rounded-[2.2rem] p-8 hover:border-brand/40 hover:bg-white/[0.03] transition-all duration-500 relative overflow-hidden"
      aria-labelledby={`svc-${service.id}`}
    >
      {/* Decorative hero background (falls back to icon if image missing) */}
      <div className="absolute inset-0 overflow-hidden rounded-[2.2rem]">
        <img
          src={`/assets/services/${service.id}-hero.webp`}
          alt=""
          className="w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity"
          onError={(e) => {
            // try jpg fallback
            if (e.currentTarget.src.endsWith('.webp')) {
              e.currentTarget.src = `/assets/services/${service.id}-hero.jpg`
              return
            }
            // hide image if still fails
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-opacity">
        <Icon name={service.iconName} size={100} />
      </div>

      <Link
        to={`/services/${service.id}`}
        className="flex flex-col h-full focus:outline-none relative z-10"
        aria-label={`View details for ${service.title}`}
      >
        <div className="w-16 h-16 mb-8 flex items-center justify-center bg-brand/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
          <Icon name={service.iconName} size={32} className="text-brand" ariaLabel={`${service.title} icon`} />
        </div>

        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Architecture</span>
          </div>
          <h3 id={`svc-${service.id}`} className="text-2xl font-bold text-white tracking-tight group-hover:text-brand transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed pb-6">
            {service.summary}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
          <div>
            <span className="text-sm text-gray-400">Professional service</span>
          </div>
          <div className="w-12 h-12 bg-white/5 group-hover:bg-brand group-hover:text-brand-contrast rounded-full flex items-center justify-center transition-all duration-500">
            <Icon name="arrow-right" size={20} />
          </div>
        </div>
      </Link>
    </article>
  )
}
