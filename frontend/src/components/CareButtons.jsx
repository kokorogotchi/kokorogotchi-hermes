import React from 'react'

const ACTIONS = [
  { id: 'feed', icon: '🍄', label: 'Feed' },
  { id: 'play', icon: '🌀', label: 'Play' },
  { id: 'rest', icon: '🌙', label: 'Rest' },
]

/**
 * CareButtons — four care action buttons with cooldown timers,
 * daily cap indicators, and loading state.
 */
export default function CareButtons({ state, connectionStatus, performAction, isLoading, lastResponse, cooldowns, canAct, actionsToday, hideResponse }) {
  const gatewayConnected = state?.gateway_connected && connectionStatus === 'connected'

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Buttons row */}
      <div style={{ display: 'flex', gap: 8 }}>
        {ACTIONS.map(action => {
          const cooldown = cooldowns[action.id] || 0
          const todayCount = actionsToday(action.id)
          const maxed = todayCount >= 6
          const disabled = !gatewayConnected || isLoading || cooldown > 0 || maxed

          return (
            <button
              key={action.id}
              className={`need-btn${maxed ? ' used' : ''}`}
              disabled={disabled}
              onClick={() => performAction(action.id)}
              style={{ position: 'relative' }}
            >
              <span className="icon">{action.icon}</span>
              <span className="nlabel">
                {!gatewayConnected ? 'offline' : maxed ? 'maxed' : cooldown > 0 ? `${cooldown}s` : action.label}
              </span>
              {isLoading && canAct(action.id) === false && cooldown === 0 && !maxed && (
                <span style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)', borderRadius: 14,
                }}>
                  <span style={{ animation: 'floatBob 1s ease-in-out infinite', fontSize: 12 }}>⋯</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Loading indicator — only show for care actions, not chat */}
      {isLoading && !hideResponse && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'var(--muted)', textAlign: 'center',
          letterSpacing: '0.1em',
        }}>
          <span style={{ animation: 'floatBob 1s ease-in-out infinite', display: 'inline-block' }}>
            responding...
          </span>
        </div>
      )}

      {/* Response bubble — hidden when chat thread is active */}
      {lastResponse && !isLoading && !hideResponse && (
        <div className="fade-in" style={{
          background: 'var(--faint)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '12px 14px',
          fontFamily: 'var(--font-serif)',
          fontSize: 12,
          color: '#ffffffcc',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {lastResponse}
        </div>
      )}
    </div>
  )
}
