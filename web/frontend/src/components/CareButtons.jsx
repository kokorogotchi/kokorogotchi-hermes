import React from 'react'

/** Inline SVG icons — ink brushwork style matching the yokai gallery */
const ICONS = {
  feed: (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <ellipse cx="14" cy="18" rx="8" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 10 Q14 6 18 10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14" y1="6" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  play: (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 4 L16 12 L24 10 L18 16 L24 22 L16 18 L14 26 L12 18 L4 22 L10 16 L4 10 L12 12 Z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  rest: (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <line x1="4" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="9" y1="12" x2="9" y2="26" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="19" y1="12" x2="19" y2="26" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="2" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
}

const ACTIONS = [
  { id: 'feed', label: '奉納', en: 'Feed' },
  { id: 'play', label: '戯れ', en: 'Play' },
  { id: 'rest', label: '静寂', en: 'Rest' },
]

/**
 * CareButtons — care action buttons with cooldown timers,
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
              <span className="icon">{ICONS[action.id]}</span>
              <span className="nlabel">
                {!gatewayConnected ? 'offline' : maxed ? 'maxed' : cooldown > 0 ? `${cooldown}s` : `${action.label} ${action.en}`}
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
