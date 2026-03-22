import React, { useEffect, useRef } from 'react'

function getFocusableElements(container){
  if(!container) return []
  return Array.from(container.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled'))
}

export default function Modal({ open, isOpen, onClose, title, children }){
  const dialogRef = useRef(null)
  const lastActiveRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  
  // Support both 'open' and 'isOpen' props for flexibility
  const isVisible = open ?? isOpen

  useEffect(()=>{
    if(!isVisible) return
    lastActiveRef.current = document.activeElement
    const dialog = dialogRef.current
    const focusables = getFocusableElements(dialog)
    if(focusables.length) focusables[0].focus()

    function onKey(e){
      if(e.key === 'Escape') onCloseRef.current && onCloseRef.current()
      if(e.key === 'Tab'){
        // basic focus trap
        const focusables = getFocusableElements(dialog)
        if(focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length -1]
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault()
          last.focus()
        } else if(!e.shiftKey && document.activeElement === last){
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return ()=>{
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if(lastActiveRef.current) lastActiveRef.current.focus()
    }
  }, [isVisible])

  if(!isVisible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div 
        ref={dialogRef} 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-10 max-w-lg w-full max-h-[90vh] overflow-auto" 
        role="document"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
