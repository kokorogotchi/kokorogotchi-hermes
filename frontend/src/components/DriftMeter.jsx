import React from 'react'

/**
 * Gradient drift meter with thumb indicator — yokai theme.
 */
export default function DriftMeter({ drift = 0 }) {
  const pct = Math.max(0, Math.min(100, drift * 100))
  const thumbColor = drift >= 0.65 ? '#3a7a58' : drift <= 0.35 ? '#c23020' : '#c8980e'

  return (
    <div style={{ width: '100%', padding: '0 2px' }}>
      <div className="mono" style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: 7,
        fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
      }}>
        <span style={{ color: '#c2302088' }}>Wild</span>
        <span style={{ color: '#3a7a5888' }}>Bonded</span>
      </div>
      <div style={{
        height: 3, borderRadius: 0,
        background: 'linear-gradient(to right, #c23020, #c8980e, #3a7a58)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -5, width: 11, height: 11,
          background: 'var(--text)', borderRadius: 2,
          left: `${pct}%`, transform: 'translateX(-50%)',
          transition: 'left 1s cubic-bezier(0.34,1.56,0.64,1), box-shadow 2s ease',
          boxShadow: `0 0 10px ${thumbColor}88`,
        }} />
      </div>
    </div>
  )
}
