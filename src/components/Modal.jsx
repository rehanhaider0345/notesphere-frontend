import React, { useEffect, useRef } from 'react'

/**
 * Modal with:
 * - body scroll lock while open
 * - focus trap (basic): cycles focus within the modal on Tab
 * - Escape to close
 *
 * Props:
 * - open: boolean
 * - onClose: fn
 * - children
 * - width, maxWidth optional
 */
function Modal({ open, onClose, children, width = '500px', maxWidth = '90vw' }) {
  const modalRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!open) return

    // Save previously focused element to restore focus after close
    previouslyFocused.current = document.activeElement

    // Lock body scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the modal container (NOT the first focusable child) to avoid stealing focus from inputs later
    const el = modalRef.current
    if (el) {
      // Make container focusable and focus it
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }

    // Keyboard handlers for Escape and Tab (focus trap)
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose && onClose()
        return
      }
      if (e.key === 'Tab') {
        // basic focus trap
        if (!el) return
        const focusableSelector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        const focusables = Array.from(el.querySelectorAll(focusableSelector)).filter(node => !node.hasAttribute('disabled'))
        if (focusables.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === el) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKeyDown)
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus()
      }
      if (el) {
        el.removeAttribute('tabindex')
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dialog"
      onMouseDown={(e) => {
        // clicking backdrop closes modal
        if (e.target === e.currentTarget) {
          onClose && onClose()
        }
      }}
      style={{
        position: 'fixed',
        zIndex: 1000,
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(30,30,30,0.28)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s'
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: 'var(--note-bg)',
          borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(16,24,40,0.12)',
          padding: '2rem 1.5rem',
          minWidth: '280px',
          width,
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          outline: 'none'
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
export default Modal