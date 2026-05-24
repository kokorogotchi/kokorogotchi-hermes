import React, { useState } from 'react'

/**
 * Naming ceremony modal — shown when Kokoro has hatched but hasn't been named yet.
 */
export default function NamingCeremony({ onComplete }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), gender }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResponse(data.response || `Welcome, ${name.trim()}!`)
        setTimeout(() => onComplete(), 3000)
      } else {
        setError(data.message || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (response) {
    return (
      <div className="fade-in" style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10, 10, 14, 0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <p style={{ fontSize: 13, color: '#e8d5a3', lineHeight: 1.8, fontStyle: 'italic' }}>
            {response}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(10, 10, 14, 0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--faint)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 24, maxWidth: 300, width: '100%',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🐣</div>
          <div className="label-xs" style={{ marginBottom: 4 }}>The egg has hatched!</div>
          <p style={{ fontSize: 11, color: '#ffffff66', lineHeight: 1.6 }}>
            Choose a name for your companion.
          </p>
        </div>

        <div>
          <label className="mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name..."
            maxLength={20}
            autoFocus
            style={{
              width: '100%', marginTop: 6,
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 12px',
              fontFamily: 'var(--font-serif)', fontSize: 15,
              color: '#e8d5a3', outline: 'none',
            }}
          />
        </div>

        <div>
          <label className="mono" style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Gender
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {['male', 'female', 'neutral'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                style={{
                  flex: 1, padding: '8px 0',
                  background: gender === g ? '#ffffff11' : 'transparent',
                  border: gender === g ? '1px solid #ffffff33' : '1px solid var(--border)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: gender === g ? '#e8d5a3' : 'var(--muted)',
                  cursor: 'pointer', textTransform: 'uppercase',
                  letterSpacing: '0.1em', transition: 'all 0.2s',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 10, color: '#e8a3a3', textAlign: 'center' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          style={{
            background: name.trim() ? '#e8d5a322' : 'transparent',
            border: '1px solid #e8d5a344',
            borderRadius: 10, padding: '12px 0',
            fontFamily: 'var(--font-serif)', fontSize: 13,
            color: name.trim() ? '#e8d5a3' : '#ffffff33',
            cursor: name.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Naming...' : 'Complete Ceremony'}
        </button>
      </form>
    </div>
  )
}
