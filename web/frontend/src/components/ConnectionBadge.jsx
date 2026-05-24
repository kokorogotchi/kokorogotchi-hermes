import React from 'react'

const STATUS_MAP = {
  connected:       { color: '#a8edca', label: 'Connected',    pulse: true  },
  connecting:      { color: '#e8d5a3', label: 'Connecting…',  pulse: true  },
  disconnected:    { color: '#e8a3c8', label: 'Disconnected', pulse: false },
  gateway_offline: { color: '#e8d5a3', label: 'Agent offline', pulse: true  },
  error:           { color: '#e8a3c8', label: 'Error',        pulse: false },
}

/**
 * Minimal connection status indicator.
 */
export default function ConnectionBadge({ status = 'connecting' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.disconnected

  return (
    <div className="mono" style={{
      fontSize: 9, color: s.color, letterSpacing: '0.12em',
      textTransform: 'uppercase',
      opacity: s.pulse ? undefined : 0.7,
      animation: s.pulse ? 'statusPulse 3s ease-in-out infinite' : 'none',
    }}>
      {s.label}
      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
