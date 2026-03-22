import React from 'react'

export default function Contact() {
  const waNumber = '923141707750'
  const text = encodeURIComponent(`Hi, I would like to discuss a project. Please assist.`)
  const waLink = `https://wa.me/${waNumber}?text=${text}`

  return (
    <div className="max-w-4xl mx-auto space-y-10 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Contact us on WhatsApp</h1>
        <p className="text-gray-400">Start a chat with our admin for a fast, tailored response.</p>
      </div>

      <div className="bg-brand-contrast p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <p className="text-gray-300 mb-6">Please start a chat with our admin on WhatsApp and include a short summary of your project, preferred timeline, and an optional contact number.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block">
          <button className="px-8 py-4 bg-brand hover:bg-brand/90 text-brand-contrast rounded-2xl font-bold">Chat on WhatsApp</button>
        </a>
      </div>
    </div>
  )
}
