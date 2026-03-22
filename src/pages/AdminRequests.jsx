import React from 'react'

export default function AdminRequests(){
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Requests</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-4">Requests are now handled via WhatsApp. Administrators can review incoming messages there.</p>
      <p className="mt-6"><a href={`https://wa.me/923141707750`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand text-white rounded-xl">Open WhatsApp</a></p>
    </div>
  )
}

function ConvertForm({ onCancel, onSave, services, request }){
  const [title, setTitle] = useState(request?.serviceTitle ? `${request.serviceTitle} — ${request.name}` : `Project for ${request?.name}`)
  const [description, setDescription] = useState(request?.message || '')
  const [serviceId, setServiceId] = useState(request?.serviceId || '')
  // price removed from UI
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ title, description, serviceId })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Title</label>
        <input className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter project title" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Related Service</label>
        <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">Select a service (optional)</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>
      {/* Price input removed from convert form */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
        <textarea className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors resize-none" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project details..." />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-brand text-white font-medium hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </>
          ) : 'Create Project'}
        </button>
      </div>
    </form>
  )
}
