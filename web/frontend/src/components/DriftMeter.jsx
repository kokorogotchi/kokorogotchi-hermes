import React from 'react'

/**
 * Gradient drift meter with thumb indicator — matches example3 style.
 */
export default function DriftMeter({ drift = 0 }) {
  const pct = Math.max(0, Math.min(100, drift * 100))
  const thumbColor = drift >= 0.65 ? '#a8edca' : drift <= 0.35 ? '#e8a3c8' : '#e8d5a3'

  return (
    <div style={{ width: '100%', padding: '0 2px' }}>
      <div className="mono" style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: 7,
        fontSize: 8, letterSpacing: '0.13em', textTransform: 'uppercase',
      }}>
        <span style={{ color: '#e8a3c888' }}>Wild</span>
        <span style={{ color: '#a8edca88' }}>Bonded</span>
      </div>
      <div style={{
        height: 4, borderRadius: 99,
        background: 'linear-gradient(to right, #e8a3c8, #e8d5a3, #a8edca)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -4, width: 12, height: 12,
          background: 'white', borderRadius: '50%',
          left: `${pct}%`, transform: 'translateX(-50%)',
          transition: 'left 1s cubic-bezier(0.34,1.56,0.64,1), box-shadow 2s ease',
          boxShadow: `0 0 8px ${thumbColor}66`,
        }} />
      </div>
    </div>
  )
}
