import { useState, useEffect, useRef } from 'react'

const MAX_BACKOFF = 30000
const INITIAL_BACKOFF = 1000
const DRIFT_ALERT_THRESHOLD = 0.3

/**
 * Hook: subscribe to Kokoro state via WebSocket with REST fallback.
 * Returns { state, connectionStatus, error, driftAlert, dismissDriftAlert }.
 */
export default function useKokoroState() {
  const [state, setState] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [error, setError] = useState(null)
  const [driftAlert, setDriftAlert] = useState(false)
  const prevDriftRef = useRef(null)
  const alertTimerRef = useRef(null)

  // Check drift threshold crossing
  const checkDriftAlert = (newState) => {
    if (!newState || newState.error) return
    const newDrift = newState.drift
    const prevDrift = prevDriftRef.current

    if (prevDrift !== null && prevDrift >= DRIFT_ALERT_THRESHOLD && newDrift < DRIFT_ALERT_THRESHOLD) {
      // Drift crossed below threshold
      setDriftAlert(true)
      // Auto-dismiss after 10 seconds
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = setTimeout(() => setDriftAlert(false), 10000)

      // Try push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Kokoro needs you', {
          body: 'Drift is getting low. Come take care of Kokoro.',
          icon: '/icons/icon-192.png',
        })
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
    prevDriftRef.current = newDrift
  }

  const dismissDriftAlert = () => {
    setDriftAlert(false)
    clearTimeout(alertTimerRef.current)
  }

  useEffect(() => {
    let disposed = false
    let ws = null
    let backoff = INITIAL_BACKOFF
    let reconnectTimer = null

    // REST fallback
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data && !disposed) {
          setState(data)
          checkDriftAlert(data)
        }
      })
      .catch(() => {})

    function connect() {
      if (disposed) return

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      ws = new WebSocket(`${protocol}//${window.location.host}/ws`)

      ws.onopen = () => {
        if (disposed) { ws.close(); return }
        setConnectionStatus('connected')
        setError(null)
        backoff = INITIAL_BACKOFF
      }

      ws.onmessage = (event) => {
        if (disposed) return
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'state.update' && msg.data) {
            setState(msg.data)
            checkDriftAlert(msg.data)
          } else if (msg.type === 'connection.status') {
            if (msg.status === 'disconnected') {
              setConnectionStatus('gateway_offline')
            }
          }
        } catch {
          // Ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (disposed) return
        setConnectionStatus('disconnected')
        scheduleReconnect()
      }

      ws.onerror = () => {
        if (disposed) return
        setError('WebSocket error')
        setConnectionStatus('error')
        ws.close()
      }
    }

    function scheduleReconnect() {
      if (disposed) return
      clearTimeout(reconnectTimer)
      const delay = backoff
      backoff = Math.min(delay * 2, MAX_BACKOFF)
      reconnectTimer = setTimeout(() => {
        if (disposed) return
        setConnectionStatus('connecting')
        connect()
      }, delay)
    }

    connect()

    return () => {
      disposed = true
      clearTimeout(reconnectTimer)
      if (ws) ws.close()
    }
  }, [])

  // Cleanup alert timer
  useEffect(() => {
    return () => clearTimeout(alertTimerRef.current)
  }, [])

  return { state, connectionStatus, error, driftAlert, dismissDriftAlert }
}
