import React from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon/Icon'

export default function Footer(){
  return (
    <footer className="bg-brand-contrast text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
                <img src="/assets/Devonic-logo.png.jpg" alt="Devonic" className="w-14 h-14 object-contain" />
              </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Elite digital agency specializing in premium web solutions, cloud architecture, and bespoke software development.
            </p>
            <div className="flex gap-4">
              {['twitter', 'github', 'linkedin'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand hover:text-white transition-all">
                  <Icon name={social} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-brand">Solutions</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/services" className="hover:text-brand transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="hover:text-brand transition-colors">Cloud Migration</Link></li>
              <li><Link to="/services" className="hover:text-brand transition-colors">UI/UX Design</Link></li>
              <li><Link to="/services" className="hover:text-brand transition-colors">Consultancy</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-brand">Company</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-brand transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact Col */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-brand">Stay Connected</h4>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none text-sm px-4 py-2 w-full focus:ring-0 outline-none"
              />
              <button className="bg-brand text-white text-xs font-bold px-4 py-2 rounded-lg">Join</button>
            </div>
            <p className="text-[10px] text-white/30 mt-4 leading-relaxed">
              * By subscribing, you agree to our Privacy Policy and provide consent to receive updates.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40">
          <p>© {new Date().getFullYear()} DEVONIC SOLUTIONS INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
