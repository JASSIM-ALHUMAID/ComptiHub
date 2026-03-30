export default function Modal({ children, open = false }) {
  if (!open) {
    return null
  }

  return <div>{children}</div>
}
