import React, { useState } from 'react'
import { SPRITES } from '../utils/sprites'

/**
 * Naming ceremony modal — shown when Kokoro has hatched but hasn't been named yet.
 * Themed to match the yokai ink-brushwork aesthetic.
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
        background: 'rgba(8,6,4,0.96)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          {/* Hatchling sprite */}
          <div style={{
            width: 80, height: 92, margin: '0 auto 20px',
            filter: 'drop-shadow(0 0 24px rgba(184,224,144,.25))',
            animation: 'floatBob 3s ease-in-out infinite',
          }} dangerouslySetInnerHTML={{ __html: SPRITES.hatchling }} />

          <div style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: 14, color: 'var(--gold)', letterSpacing: '0.2em',
            marginBottom: 14,
          }}>
            命名の儀
          </div>

          <p style={{
            fontSize: 14, color: 'var(--cream)', lineHeight: 1.9,
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
          }}>
            {response}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(8,6,4,0.96)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 4, padding: 28, maxWidth: 300, width: '100%',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {/* Header with hatchling sprite */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 74, margin: '0 auto 12px',
            filter: 'drop-shadow(0 0 16px rgba(184,224,144,.2))',
          }} dangerouslySetInnerHTML={{ __html: SPRITES.hatchling }} />

          <div style={{
            fontFamily: 'var(--font-serif)', fontWeight: 700,
            fontSize: 16, color: 'var(--text)', letterSpacing: '0.12em',
            marginBottom: 4,
          }}>
            命名の儀
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em',
          }}>
            The Naming Ceremony
          </div>
          <p style={{
            fontSize: 11, color: 'var(--cream)', lineHeight: 1.7,
            marginTop: 10, fontFamily: 'var(--font-body)',
          }}>
            A spirit has emerged from the egg. Speak its name to bind it to this world.
          </p>
        </div>

        {/* Name input */}
        <div>
          <label className="mono" style={{
            fontSize: 8, letterSpacing: '0.35em',
            color: 'var(--muted)', textTransform: 'uppercase',
          }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="speak a name..."
            maxLength={20}
            autoFocus
            style={{
              width: '100%', marginTop: 6,
              background: 'var(--faint)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '10px 12px',
              fontFamily: 'var(--font-serif)', fontSize: 15,
              color: 'var(--text)', outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--gold-dim)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Gender selection */}
        <div>
          <label className="mono" style={{
            fontSize: 8, letterSpacing: '0.35em',
            color: 'var(--muted)', textTransform: 'uppercase',
          }}>
            Spirit
          </label>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {[
              { id: 'male', label: '雄 Male' },
              { id: 'female', label: '雌 Female' },
              { id: 'neutral', label: '無 Neutral' },
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                style={{
                  flex: 1, padding: '8px 0',
                  background: gender === g.id ? 'rgba(200,152,14,.08)' : 'transparent',
                  border: gender === g.id ? '1px solid var(--gold-dim)' : '1px solid var(--border)',
                  borderRadius: 4,
                  fontFamily: 'var(--font-label)', fontSize: 9,
                  color: gender === g.id ? 'var(--gold)' : 'var(--muted)',
                  cursor: 'pointer', letterSpacing: '0.15em',
                  transition: 'all 0.25s',
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 10, color: 'var(--vermilion)', textAlign: 'center' }}>{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          style={{
            background: name.trim() ? 'rgba(194,48,32,.1)' : 'transparent',
            border: name.trim() ? '1px solid rgba(194,48,32,.4)' : '1px solid var(--border)',
            borderRadius: 4, padding: '12px 0',
            fontFamily: 'var(--font-label)', fontSize: 10,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: name.trim() ? 'var(--vermilion)' : 'var(--muted)',
            cursor: name.trim() ? 'pointer' : 'default',
            transition: 'all 0.25s',
          }}
        >
          {isSubmitting ? '...binding...' : '封印 Seal Name'}
        </button>
      </form>
    </div>
  )
}
