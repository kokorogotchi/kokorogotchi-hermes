import React from 'react'
import EvolutionMap from './EvolutionMap'

/**
 * StatsTab — care summary + evolution map.
 */
export default function StatsTab({ state }) {
  const careLog = state?.care_log || []
  const totalInteractions = careLog.length
  const streak = state?.streak || 0
  const daysMissed = state?.days_missed || 0

  // Time since last care
  const timeSinceLastCare = () => {
    if (!state?.last_cared_at) return 'never'
    const last = new Date(state.last_cared_at)
    const now = new Date()
    const diffMs = now - last
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    return `${diffDays}d ago`
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Care summary */}
      <div style={{
        background: 'var(--faint)', border: '1px solid var(--border)',
        borderRadius: 4, padding: 14,
      }}>
        <div className="mono" style={{
          fontSize: 9, letterSpacing: '0.35em',
          color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10,
        }}>Care Summary</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Total', value: totalInteractions },
            { label: 'Streak', value: `${streak}d` },
            { label: 'Missed', value: `${daysMissed}d` },
            { label: 'Last', value: timeSinceLastCare() },
          ].map(stat => (
            <div key={stat.label} className="stat">
              <div className="slabel">{stat.label}</div>
              <div className="sval">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution map */}
      <div style={{
        background: 'var(--faint)', border: '1px solid var(--border)',
        borderRadius: 4, padding: 14,
      }}>
        <div className="mono" style={{
          fontSize: 9, letterSpacing: '0.35em',
          color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10,
        }}>Evolution Paths</div>
        <EvolutionMap currentStage={state?.evolution_stage || 'egg'} />
      </div>
    </div>
  )
}
