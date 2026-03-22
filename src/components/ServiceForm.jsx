import React, { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import Icon from './Icon/Icon'
import { toast } from 'react-hot-toast'

function validate(values){
  const errs = {}
  if(!values.title || values.title.trim().length < 3) errs.title = 'Title must be at least 3 characters'
  if(!values.summary || values.summary.trim().length < 5) errs.summary = 'Summary is required'
  return errs
}

export default function ServiceForm({ initial, onCancel, onSaved }){
  const [values, setValues] = useState({ title: '', summary: '', description: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const firstInputRef = useRef(null)

  useEffect(()=>{ if(initial) setValues({ title: initial.title || '', summary: initial.summary || '', description: initial.description || '' }) }, [initial])
  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus()
  }, [])

  const handle = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value }))

  // Debug helper: log input events when typing (safe to remove later)
  const debugHandle = (e) => {
    // eslint-disable-next-line no-console
    console.debug('input', e.target.name, e.target.value)
    handle(e)
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if(Object.keys(errs).length) return
    setSaving(true)
    try{
      if(initial && initial.id){
        await api.updateService(initial.id, values)
      } else {
        await api.createService(values)
      }
      toast.success('Service saved')
      onSaved && onSaved()
    }catch(err){
      setErrors({ form: err?.message || 'Failed to save service. Please try again.' })
      toast.error(err?.message || 'Failed to save service')
    }finally{ setSaving(false) }
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]" role="dialog" aria-modal="true">
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-xl font-black text-brand-contrast uppercase tracking-tight">
          {initial ? 'Edit Service' : 'Initialize New Service'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Icon name="x" size={20} />
        </button>
      </div>

      <div className="px-8 py-8 overflow-y-auto custom-scrollbar">
        <form id="svc-form" onSubmit={submit} className="space-y-6">
          {errors.form && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
              <Icon name="activity" size={18} />
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Service Title</label>
              <input 
                ref={firstInputRef}
                name="title" 
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
                placeholder="e.g. Enterprise Cloud Integration"
                value={values.title} 
                onChange={debugHandle} 
                className={`w-full px-5 py-3 rounded-xl border transition-all text-sm font-bold text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand/10 outline-none ${errors.title ? 'border-red-300' : 'border-gray-200 focus:border-brand'}`}
              />
              {errors.title && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.title}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Summary</label>
              <input 
                name="summary" 
                placeholder="Brief one-liner for search results"
                value={values.summary} 
                onChange={debugHandle} 
                className={`w-full px-5 py-3 rounded-xl border transition-all text-sm font-bold text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand/10 outline-none ${errors.summary ? 'border-red-300' : 'border-gray-200 focus:border-brand'}`}
              />
              {errors.summary && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.summary}</p>}
            </div>

            {/* Price input removed from UI per request */}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
              <div className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 flex items-center justify-between">
                <span>ACTIVE_STABLE</span>
                <Icon name="check" size={14} className="text-green-500" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Technical Specifications</label>
              <textarea 
                name="description" 
                placeholder="Detailed project scope, deliverables, and timelines..."
                value={values.description} 
                onChange={debugHandle} 
                rows={5}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-brand transition-all text-sm font-medium text-gray-900 focus:text-gray-900 focus:ring-4 focus:ring-brand/10 outline-none resize-none"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-contrast transition-colors"
        >
          Discard
        </button>
        <button 
          form="svc-form"
          type="submit" 
          disabled={saving}
          className="px-8 py-2.5 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : 'Confirm Changes'}
        </button>
      </div>
    </div>
  )
}
