import { useEffect, useRef, useCallback } from 'react'

const POLL_INTERVAL = 5_000
const PILARGROUP_STATUS_URL = `${import.meta.env.VITE_PILARGROUP_URL}/api/auth/status`

function getStoredToken() {
  return localStorage.getItem('fl_token')
}

function getStoredCv() {
  try {
    const raw = localStorage.getItem('fl_user')
    if (!raw) return null
    return JSON.parse(raw)?.cv ?? null
  } catch {
    return null
  }
}

function clearSession() {
  localStorage.removeItem('fl_token')
  localStorage.removeItem('fl_user')
}

export function useSessionGuard(onExpired) {
  const intervalRef = useRef(null)
  const onExpiredRef = useRef(onExpired)

  useEffect(() => {
    onExpiredRef.current = onExpired
  }, [onExpired])

  const check = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      onExpiredRef.current?.()
      return
    }

    try {
      const res = await fetch(PILARGROUP_STATUS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        clearSession()
        onExpiredRef.current?.()
        return
      }

      if (!res.ok) return // pilargroup down, skip

      const data = await res.json()

      if (!data.valid) {
        clearSession()
        onExpiredRef.current?.()
        return
      }

      // Double check cv
      const storedCv = getStoredCv()
      if (data.token_version !== undefined && storedCv !== null) {
        if (Number(storedCv) !== Number(data.token_version)) {
          clearSession()
          onExpiredRef.current?.()
        }
      }
    } catch {
      // Network error sementara, jangan logout
    }
  }, [])

  useEffect(() => {
    const token = getStoredToken()
    if (!token) return

    check()
    intervalRef.current = setInterval(check, POLL_INTERVAL)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [check])
}