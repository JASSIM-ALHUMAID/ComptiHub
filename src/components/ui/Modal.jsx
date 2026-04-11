export default function Modal({ children, open = false, className = '', onBackdropClick = null }) {
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
      aria-modal="true"
      className={`fixed inset-0 z-[80] ${className}`}
      role="dialog"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  )
}
