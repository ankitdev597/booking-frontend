import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Counts down from a server-provided ISO 8601 expiry timestamp.
 * Uses the server timestamp as source of truth — immune to local clock skew.
 */
export function useCountdown(expiresAt: string | null): {
  remaining: number
  isExpired: boolean
} {
  const computeRemaining = useCallback(() => {
    if (!expiresAt) return 0
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
  }, [expiresAt])

  const [remaining, setRemaining] = useState<number>(computeRemaining)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0)
      return
    }

    setRemaining(computeRemaining())

    intervalRef.current = setInterval(() => {
      const r = computeRemaining()
      setRemaining(r)
      if (r <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [expiresAt, computeRemaining])

  return { remaining, isExpired: remaining <= 0 }
}
