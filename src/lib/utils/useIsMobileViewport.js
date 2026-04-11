import { useEffect, useState } from 'react'

const mobileViewportQuery = '(max-width: 1023px)'

function getInitialMatch() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(mobileViewportQuery).matches
}

export function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(getInitialMatch)

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileViewportQuery)

    function handleChange(event) {
      setIsMobileViewport(event.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    mediaQuery.addListener(handleChange)

    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  return isMobileViewport
}
