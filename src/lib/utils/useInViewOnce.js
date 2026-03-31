import { useEffect, useRef, useState } from 'react'

export function useInViewOnce({ threshold = 0.18, root = null, rootMargin = '0px 0px -12% 0px' } = {}) {
  const targetRef = useRef(null)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof window.IntersectionObserver === 'undefined'
    )
  })

  useEffect(() => {
    if (isVisible) {
      return undefined
    }

    const node = targetRef.current

    if (!node) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return
        }

        setIsVisible(true)
        observer.disconnect()
      },
      { root, rootMargin, threshold },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [isVisible, root, rootMargin, threshold])

  return [targetRef, isVisible]
}
