import { useEffect, useRef } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export default function Modal({
  children,
  open = false,
  className = '',
  onBackdropClick = null,
  onClose = null,
  ...props
}) {
  const modalRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const closeHandlerRef = useRef(null)
  const closeHandler = onClose ?? onBackdropClick

  useEffect(() => {
    closeHandlerRef.current = closeHandler
  }, [closeHandler])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const modalNode = modalRef.current

    if (modalNode) {
      const focusableElements = Array.from(modalNode.querySelectorAll(focusableSelector))
      const firstFocusable = focusableElements.find((element) => element instanceof HTMLElement)
      ;(firstFocusable ?? modalNode).focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeHandlerRef.current?.()
        return
      }

      if (event.key !== 'Tab' || !modalNode) {
        return
      }

      const focusableElements = Array.from(modalNode.querySelectorAll(focusableSelector)).filter(
        (element) => element instanceof HTMLElement,
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        modalNode.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      }

      if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)

      if (restoreFocusRef.current instanceof HTMLElement) {
        restoreFocusRef.current.focus()
      }
    }
  }, [open])

  if (!open) {
    return null
  }

  function handleBackdropClick(event) {
    if (event.target !== event.currentTarget) {
      return
    }

    onBackdropClick?.()
  }

  return (
    <div
      ref={modalRef}
      aria-modal="true"
      className={`fixed inset-0 z-[80] ${className}`}
      role="dialog"
      tabIndex={-1}
      onClick={handleBackdropClick}
      {...props}
    >
      {children}
    </div>
  )
}
