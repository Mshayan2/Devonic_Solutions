import React, { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import Icon from '../components/Icon/Icon'
import Skeleton from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import { toast } from 'react-hot-toast'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [form, setForm] = useState({ title: '', summary: '', price: 0, duration: '', published: true, thumbnailUrl: '', tags: '', level: 'beginner' })
  const [saving, setSaving] = useState(false)
  const thumbInputRef = useRef(null)

  async function fetchData() {
    setLoading(true)
    try {
      const cData = await api.adminListCourses()
      setCourses(cData)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  

  function openCreate() {
    setEditingCourse(null)
    setForm({ title: '', summary: '', price: 0, duration: '', published: true, thumbnailUrl: '', tags: '', level: 'beginner' })
    setShowModal(true)
  }

  function openEdit(c) {
    setEditingCourse(c)
    setForm({ title: c.title, summary: c.summary || '', price: c.price || 0, duration: c.duration || '', published: c.published !== false, thumbnailUrl: c.thumbnailUrl || '', tags: Array.isArray(c.tags) ? c.tags.join(', ') : (c.tags || ''), level: c.level || 'beginner' })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      // Format data before sending
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }
      if (editingCourse) {
        await api.adminUpdateCourse(editingCourse.id, payload)
        toast.success('Course updated')
      } else {
        await api.adminCreateCourse(payload)
        toast.success('Course created')
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Error saving course')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this course?')) return
    try {
      await api.adminDeleteCourse(id)
      toast.success('Course deleted')
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Error deleting course')
    }
  }

  async function togglePublish(c) {
    try {
      await api.adminPublishCourse(c.id, !c.published)
      toast.success(c.published ? 'Course unpublished' : 'Course published')
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Error updating course')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
        <Button onClick={openCreate}><Icon name="plus" className="w-4 h-4 mr-1" /> Add Course</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <Icon name="bookOpen" className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first course</p>
          <Button onClick={openCreate}><Icon name="plus" className="w-4 h-4 mr-2" />Add Course</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                {/* Price column removed per global UI rule */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-brand/20 to-brand-contrast/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {c.thumbnailUrl ? (
                          <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="bookOpen" className="w-6 h-6 text-brand" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{c.title}</div>
                        {c.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-brand/10 text-brand rounded">
                                {tag}
                              </span>
                            ))}
                            {c.tags.length > 3 && (
                              <span className="text-[10px] text-gray-400">+{c.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.duration || '-'}</td>
                  {/* price hidden from admin table per UI requirement */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${c.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {c.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => togglePublish(c)} 
                        className={`p-2 rounded-lg transition-colors ${c.published ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                        title={c.published ? 'Unpublish' : 'Publish'}
                      >
                        <Icon name={c.published ? 'eyeSlash' : 'eye'} className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openEdit(c)} 
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Icon name="edit" className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Icon name="trash" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSave} className="space-y-5">
          {/* Thumbnail Preview & URL */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Thumbnail</label>
            <div className="flex items-start gap-4">
                <div
                  onClick={() => thumbInputRef.current?.click()}
                  role="button"
                  className="w-32 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                  {form.thumbnailUrl ? (
                    <img src={form.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="bookOpen" className="w-8 h-8" />
                    </div>
                  )}
                </div>
                {/* hidden file input to allow uploading an image from disk */}
                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" tabIndex={-1} aria-hidden="true" onChange={async (e) => {
                  const f = e.target.files && e.target.files[0]
                  if (!f) return
                  try {
                    const reader = new FileReader()
                    reader.onload = () => {
                      setForm({ ...form, thumbnailUrl: reader.result })
                    }
                    reader.readAsDataURL(f)
                  } catch (err) {
                    console.error(err)
                    toast.error('Failed to read image')
                  }
                }} />
              <div className="flex-1">
                <input 
                  type="url"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-sm" 
                  value={form.thumbnailUrl} 
                  onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} 
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Enter an image URL for the course thumbnail</p>
              </div>
            </div>
          </div>

          <FormInput label="Course Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Advanced Web Development" required />
          
          {/* Instructor management removed from UI */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Summary</label>
            <textarea 
              rows={3} 
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors resize-none" 
              value={form.summary} 
              onChange={e => setForm({ ...form, summary: e.target.value })} 
              placeholder="Brief description of the course content..."
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 8 weeks" />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Level</label>
              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
            <input 
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand transition-colors" 
              value={form.tags} 
              onChange={e => setForm({ ...form, tags: e.target.value })} 
              placeholder="web, javascript, react (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} id="pub" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
            <label htmlFor="pub" className="text-sm text-gray-700 dark:text-gray-300">Publish immediately (visible to students)</label>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingCourse ? 'Update Course' : 'Create Course'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
