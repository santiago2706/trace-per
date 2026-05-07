import { useEffect, useState } from 'react'

/**
 * Hook to check if the component has been hydrated on the client.
 * Essential for components that rely on browser-only state (localStorage, window, etc.)
 * to avoid SSR mismatches in TanStack Start/Vercel.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
