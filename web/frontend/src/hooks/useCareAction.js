import { useState, useCallback, useRef, useEffect } from 'react'

const COOLDOWN_MS = 30000
const CHAT_COOLDOWN_MS = 10000
const MAX_DAILY_PER_TYPE = 6

/**
 * Hook: dispatch care actions with cooldown and daily cap tracking.
 * Returns { performAction, isLoading, lastResponse, cooldowns, caps, canAct }
 */
export default function useCareAction(state) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResponse, setLastResponse] = useState(null)
  const [cooldowns, setCooldowns] = useState({})
  const timersRef = useRef({})

  // Count today's actions per type from care_log
  const getTodayCounts = useCallback(() => {
    if (!state?.care_log) return {}
    const today = new Date().toISOString().slice(0, 10)
    const counts = {}
    for (const entry of state.care_log) {
      const entryDate = entry.at?.slice(0, 10)
      if (entryDate === today) {
        // Extract action type from the action string (e.g., "fed Aporo" → "feed")
        const action = entry.action || ''
        let type = null
        if (action.startsWith('fed')) type = 'feed'
        else if (action.startsWith('played')) type = 'play'
        else if (action.startsWith('talked') || action.startsWith('spoke')) type = 'talk'
        else if (action.startsWith('let') || action.startsWith('rest')) type = 'rest'
        if (type) {
          counts[type] = (counts[type] || 0) + 1
        }
      }
    }
    return counts
  }, [state?.care_log])

  // Check if a specific action can be performed
  const canAct = useCallback((type) => {
    if (isLoading) return false
    if (cooldowns[type] > 0) return false
    const counts = getTodayCounts()
    if ((counts[type] || 0) >= MAX_DAILY_PER_TYPE) return false
    return true
  }, [isLoading, cooldowns, getTodayCounts])

  // Get actions today count for a type
  const actionsToday = useCallback((type) => {
    const counts = getTodayCounts()
    return counts[type] || 0
  }, [getTodayCounts])

  // Perform a care action
  const performAction = useCallback(async (type) => {
    if (!canAct(type)) return null
    setIsLoading(true)
    setLastResponse(null)

    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setLastResponse(data.response || 'Kokoro acknowledged.')
        // Start cooldown for this action type
        setCooldowns(prev => ({ ...prev, [type]: COOLDOWN_MS / 1000 }))
        startCooldownTimer(type)
      } else {
        setLastResponse(data.message || 'Something went wrong.')
      }
      return data
    } catch (err) {
      setLastResponse('Network error. Try again.')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [canAct])

  // Send a free-form chat message (counts as "talk" action)
  const sendChat = useCallback(async (text) => {
    if (!canAct('talk')) return null
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        // Start shorter cooldown for chat
        setCooldowns(prev => ({ ...prev, talk: CHAT_COOLDOWN_MS / 1000 }))
        startCooldownTimer('talk')
        return data
      } else {
        return data
      }
    } catch (err) {
      return null
    } finally {
      setIsLoading(false)
    }
  }, [canAct])

  // Cooldown timer per action type
  const startCooldownTimer = useCallback((type) => {
    if (timersRef.current[type]) clearInterval(timersRef.current[type])
    timersRef.current[type] = setInterval(() => {
      setCooldowns(prev => {
        const remaining = (prev[type] || 0) - 1
        if (remaining <= 0) {
          clearInterval(timersRef.current[type])
          delete timersRef.current[type]
          const { [type]: _, ...rest } = prev
          return rest
        }
        return { ...prev, [type]: remaining }
      })
    }, 1000)
  }, [])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearInterval)
    }
  }, [])

  return {
    performAction,
    sendChat,
    isLoading,
    lastResponse,
    cooldowns,
    canAct,
    actionsToday,
  }
}
