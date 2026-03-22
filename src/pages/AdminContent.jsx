import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

const emptyContent = {
  hero: {
    title: '',
    subtitle: '',
    primaryCta: { label: '', href: '' },
    secondaryCta: { label: '', href: '' }
  },
  highlights: [
    { id: 'hl-1', title: '', body: '', iconName: 'check' },
    { id: 'hl-2', title: '', body: '', iconName: 'layers' },
    { id: 'hl-3', title: '', body: '', iconName: 'users' }
  ],
  cta: {
    title: '',
    subtitle: '',
    primaryCta: { label: '', href: '' }
  }
}

export default function AdminContent() {
  const [values, setValues] = useState(emptyContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    api.getHomeContent().then((data) => {
      if (!mounted) return
      setValues({
        hero: {
          title: data?.hero?.title || '',
          subtitle: data?.hero?.subtitle || '',
          primaryCta: data?.hero?.primaryCta || { label: '', href: '' },
          secondaryCta: data?.hero?.secondaryCta || { label: '', href: '' }
        },
        highlights: Array.isArray(data?.highlights) && data.highlights.length
          ? data.highlights
          : emptyContent.highlights,
        cta: {
          title: data?.cta?.title || '',
          subtitle: data?.cta?.subtitle || '',
          primaryCta: data?.cta?.primaryCta || { label: '', href: '' }
        }
      })
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const updateField = (path, value) => {
    setValues((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      let cursor = next
      for (let i = 0; i < path.length - 1; i += 1) cursor = cursor[path[i]]
      cursor[path[path.length - 1]] = value
      return next
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!values.hero.title.trim() || !values.hero.subtitle.trim()) {
      toast.error('Hero title and subtitle are required')
      return
    }
    setSaving(true)
    try {
      await api.updateHomeContent(values)
      toast.success('Homepage content updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading content...</div>
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-brand-contrast">Homepage Content</h1>
        <p className="text-sm text-gray-500">Manage the hero, highlights, and CTA section on the homepage.</p>
      </div>

      <form onSubmit={submit} className="space-y-8">
        <section className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-brand-contrast">Hero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Title</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.hero.title}
                onChange={(e) => updateField(['hero', 'title'], e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Subtitle</label>
              <textarea
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                rows={3}
                value={values.hero.subtitle}
                onChange={(e) => updateField(['hero', 'subtitle'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Primary CTA Label</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.hero.primaryCta.label}
                onChange={(e) => updateField(['hero', 'primaryCta', 'label'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Primary CTA Link</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.hero.primaryCta.href}
                onChange={(e) => updateField(['hero', 'primaryCta', 'href'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Secondary CTA Label</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.hero.secondaryCta.label}
                onChange={(e) => updateField(['hero', 'secondaryCta', 'label'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Secondary CTA Link</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.hero.secondaryCta.href}
                onChange={(e) => updateField(['hero', 'secondaryCta', 'href'], e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-brand-contrast">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.highlights.map((item, idx) => (
              <div key={item.id || idx} className="space-y-3">
                <label className="text-xs font-bold text-gray-500">Title</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={item.title}
                  onChange={(e) => updateField(['highlights', idx, 'title'], e.target.value)}
                />
                <label className="text-xs font-bold text-gray-500">Body</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  rows={3}
                  value={item.body}
                  onChange={(e) => updateField(['highlights', idx, 'body'], e.target.value)}
                />
                <label className="text-xs font-bold text-gray-500">Icon Name</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={item.iconName}
                  onChange={(e) => updateField(['highlights', idx, 'iconName'], e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
          <h2 className="text-lg font-black text-brand-contrast">CTA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Title</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.cta.title}
                onChange={(e) => updateField(['cta', 'title'], e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Subtitle</label>
              <textarea
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                rows={3}
                value={values.cta.subtitle}
                onChange={(e) => updateField(['cta', 'subtitle'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Primary CTA Label</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.cta.primaryCta.label}
                onChange={(e) => updateField(['cta', 'primaryCta', 'label'], e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">Primary CTA Link</label>
              <input
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200"
                value={values.cta.primaryCta.href}
                onChange={(e) => updateField(['cta', 'primaryCta', 'href'], e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-brand text-white font-bold shadow-lg shadow-brand/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
