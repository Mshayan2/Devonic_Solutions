import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import ServiceForm from '../components/ServiceForm'
import Icon from '../components/Icon/Icon'
import Modal from '../components/ui/Modal'

export default function AdminServices(){
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    let mounted = true
    api.listServices().then(data => {
      if(!mounted) return
      setServices(Array.isArray(data) ? data : [])
      setLoading(false)
    })
    return () => mounted = false
  }, [])

  const refresh = () => {
    setLoading(true)
    api.listServices().then(data => { setServices(Array.isArray(data) ? data : []); setLoading(false) })
  }

  const handleCreate = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (svc) => { setEditing(svc); setShowForm(true) }
  const handleDelete = async (id) => {
    // optimistic remove
    const prev = services
    setServices(s => s.filter(x => x.id !== id))
    setConfirmDeleteId(null)
    try {
      await api.deleteService(id)
    } catch (err) {
      // revert
      setServices(prev)
      alert('Failed to delete service: ' + err.message)
    }
  }

  const pagedServices = () => {
    const start = (page - 1) * pageSize
    return services.slice(start, start + pageSize)
  }

  const totalPages = Math.max(1, Math.ceil(services.length / pageSize))

  return (
    <div className="space-y-10 pb-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-contrast tracking-tight mb-2 uppercase">Service Inventory</h1>
          <p className="text-sm font-medium text-gray-500">Configure and manage your digital service offerings.</p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 active:scale-95"
        >
          <Icon name="plus" size={18} />
          Add New Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-contrast/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <ServiceForm
              initial={editing}
              onCancel={() => setShowForm(false)}
              onSaved={() => { setShowForm(false); refresh() }}
            />
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                <th className="px-8 py-5">Service Details</th>
                <th className="px-8 py-5">Category/Meta</th>
                {/* Value column removed to hide prices */}
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({length:3}).map((_,i) => (
                  <tr key={i}>
                    <td colSpan="3" className="px-8 py-10"><div className="h-4 w-48 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <Icon name="activity" size={48} className="opacity-20" />
                      <p className="font-bold">No services found in inventory.</p>
                    </div>
                  </td>
                </tr>
              ) : pagedServices().map((s) => (
                <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <h3 className="text-base font-black text-brand-contrast mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{s.summary}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <Icon name="tag" size={10} />
                      Premium
                    </span>
                  </td>
                  {/* price hidden from admin inventory */}
                  <td className="px-8 py-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        className="p-2.5 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                        title="Edit Service"
                      >
                        <Icon name="edit" size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(s.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        aria-label={`Delete ${s.title}`}
                        title="Delete Service"
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      {services.length > pageSize && (
        <div className="flex items-center justify-end gap-3 mt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p-1))} 
            disabled={page===1} 
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Icon name="arrow-left" size={16} />
            Previous
          </button>
          <div className="text-sm text-gray-600 font-medium">Page {page} of {totalPages}</div>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p+1))} 
            disabled={page===totalPages} 
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
          >
            Next
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      )}

      <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Delete Service">
        <div className="space-y-5">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
            <Icon name="trash" className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-gray-600 dark:text-gray-400">This will permanently delete this service. This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={() => setConfirmDeleteId(null)} className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button onClick={() => handleDelete(confirmDeleteId)} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
              <Icon name="trash" size={16} />
              Delete Service
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
