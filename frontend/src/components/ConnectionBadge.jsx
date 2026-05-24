import React from 'react'

const STATUS_MAP = {
  connected:       { color: '#6ee7a0', label: 'Connected',    pulse: true  },
  connecting:      { color: '#f0c040', label: 'Connecting…',  pulse: true  },
  disconnected:    { color: '#f06050', label: 'Disconnected', pulse: false },
  gateway_offline: { color: '#f0c040', label: 'Agent offline', pulse: true  },
  error:           { color: '#f06050', label: 'Error',        pulse: false },
}

/**
 * Minimal connection status indicator.
 */
export default function ConnectionBadge({ status = 'connecting' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.disconnected

  return (
    <div className="mono" style={{
      fontSize: 9, color: s.color, letterSpacing: '0.25em',
      textTransform: 'uppercase',
      opacity: s.pulse ? undefined : 0.85,
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
