import React, { useState, useEffect, useCallback } from 'react'

/**
 * JournalTab — displays Kokoro's journal entries with pagination.
 * Fetches from GET /api/journal with limit/offset.
 */
export default function JournalTab({ name }) {
  const [entries, setEntries] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 10

  const fetchEntries = useCallback(async (currentOffset) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/journal?limit=${limit}&offset=${currentOffset}`)
      const data = await res.json()
      if (currentOffset === 0) {
        setEntries(data.entries || [])
      } else {
        setEntries(prev => [...prev, ...(data.entries || [])])
      }
      setTotal(data.total || 0)
      setHasMore(data.has_more || false)
    } catch {
      // Network error — keep existing entries
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries(0)
  }, [fetchEntries])

  const loadMore = () => {
    const newOffset = offset + limit
    setOffset(newOffset)
    fetchEntries(newOffset)
  }

  // Relative date formatting
  const relativeDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Drift color
  const driftColor = (drift) => {
    if (drift < 0.3) return '#e8a3c8'
    if (drift < 0.6) return '#e8d5a3'
    return '#a8edca'
  }

  // Empty state
  if (!loading && entries.length === 0) {
    return (
      <div className="fade-in" style={{
        background: 'var(--faint)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 20, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📔</div>
        <p style={{ fontSize: 11, color: '#ffffff44', fontStyle: 'italic' }}>
          {name ? `${name} hasn't written anything yet` : "Kokoro hasn't written anything yet."}
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="mono" style={{
        fontSize: 8, letterSpacing: '0.16em',
        color: 'var(--muted)', textTransform: 'uppercase',
      }}>
        {name || 'Kokoro'}'s Journal — private
        {total > 0 && <span style={{ marginLeft: 8, opacity: 0.5 }}>({total})</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.map((entry, i) => (
          <div key={i} className="fade-in" style={{
            background: 'var(--faint)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 8, color: '#ffffff44' }}>
                {relativeDate(entry.date)}
              </span>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: driftColor(entry.drift),
                opacity: 0.7,
              }} />
            </div>
            <p style={{
              fontSize: 12, color: '#ffffffcc',
              lineHeight: 1.7, fontStyle: 'italic',
            }}>
              {entry.text}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 10, padding: '8px 12px',
            fontFamily: 'var(--font-mono)', fontSize: 8,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--muted)', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'loading...' : 'load more'}
        </button>
      )}

      {loading && entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>loading...</span>
        </div>
      )}
    </div>
  )
}
