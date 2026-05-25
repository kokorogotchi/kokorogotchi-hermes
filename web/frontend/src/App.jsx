import React, { useState, useCallback } from 'react'
import useKokoroState from './hooks/useKokoroState'
import useCareAction from './hooks/useCareAction'
import CreatureView from './components/CreatureView'
import CareButtons from './components/CareButtons'
import ConnectionBadge from './components/ConnectionBadge'
import ScanlineOverlay from './components/ScanlineOverlay'
import JournalTab from './components/JournalTab'
import StatsTab from './components/StatsTab'
import NamingCeremony from './components/NamingCeremony'
import ChatThread from './components/ChatThread'
import ChatInput from './components/ChatInput'
import { STAGES, PATHS } from './utils/stages'

export default function App() {
  const { state, connectionStatus, driftAlert, dismissDriftAlert } = useKokoroState()
  const { performAction, sendChat, isLoading, lastResponse, cooldowns, canAct, actionsToday } = useCareAction(state)
  const [openPanel, setOpenPanel] = useState(null)
  const [namingDismissed, setNamingDismissed] = useState(false)
  const [chatMessages, setChatMessages] = useState([])

  // Append a message to the chat thread
  const addChatMessage = useCallback((role, text) => {
    setChatMessages(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      text: String(text),
      timestamp: Date.now(),
    }])
  }, [])

  // Send a chat message and get Kokoro's response
  const handleSendChat = useCallback(async (text) => {
    addChatMessage('user', text)
    try {
      const result = await sendChat(text)
      if (result?.success) {
        const reply = typeof result.response === 'string' ? result.response : '...'
        addChatMessage('kokoro', reply || '...')
      } else if (result?.message) {
        addChatMessage('kokoro', `⚠ ${result.message}`)
      } else if (!result) {
        addChatMessage('kokoro', '⚠ Network error. Try again.')
      }
    } catch (err) {
      addChatMessage('kokoro', '⚠ Something went wrong.')
    }
  }, [sendChat, addChatMessage])

  const stage = state ? (STAGES[state.evolution_stage] || STAGES.egg) : STAGES.egg

  const togglePanel = (id) => setOpenPanel(prev => prev === id ? null : id)

  // Loading state
  if (!state) {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ScanlineOverlay />
        <div className="fade-in" style={{ textAlign: 'center', padding: 24 }}>
          {/* Egg sprite with breathing animation */}
          <div style={{
            width: 100, height: 120, margin: '0 auto 28px',
            animation: 'floatBob 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 30px rgba(154,184,200,.2))',
          }} dangerouslySetInnerHTML={{ __html: `<svg width="100" height="120" viewBox="0 0 140 160">
            <defs>
              <radialGradient id="ceg1" cx="38%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#dde8f0"/>
                <stop offset="55%" stop-color="#9ab8c8"/>
                <stop offset="100%" stop-color="#4a6878"/>
              </radialGradient>
            </defs>
            <ellipse cx="70" cy="90" rx="42" ry="54" fill="url(#ceg1)"/>
            <text x="70" y="98" text-anchor="middle" font-family="Noto Serif JP, serif" font-size="22" fill="#4a6878" opacity="0.5" letter-spacing="2">霊</text>
            <ellipse cx="52" cy="62" rx="10" ry="6" fill="white" opacity="0.18" transform="rotate(-30 52 62)"/>
          </svg>` }} />

          {/* Title */}
          <div style={{
            fontFamily: 'var(--font-serif)', fontWeight: 900,
            fontSize: 22, letterSpacing: '0.15em', color: 'var(--text)',
            marginBottom: 6,
          }}>
            <span style={{ color: 'var(--vermilion)' }}>妖怪</span>ごっち
          </div>

          {/* Subtitle */}
          <div style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em',
            marginBottom: 24,
          }}>
            Kokorogotchi
          </div>

          {/* Status */}
          <div className="mono" style={{
            fontSize: 9, color: 'var(--muted)', letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}>
            <span style={{ display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>●</span>
            {' '}summoning spirit...
          </div>
        </div>
      </div>
    )
  }

  // No-state screen (state.json doesn't exist)
  if (state.error === 'no_state') {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ScanlineOverlay />
        <div className="fade-in" style={{ textAlign: 'center', padding: 24, maxWidth: 320 }}>
          {/* Egg sprite */}
          <div style={{
            width: 100, height: 120, margin: '0 auto 28px',
            opacity: 0.6,
            filter: 'drop-shadow(0 0 20px rgba(194,48,32,.15))',
          }} dangerouslySetInnerHTML={{ __html: `<svg width="100" height="120" viewBox="0 0 140 160">
            <defs>
              <radialGradient id="neg1" cx="38%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#dde8f0"/>
                <stop offset="55%" stop-color="#9ab8c8"/>
                <stop offset="100%" stop-color="#4a6878"/>
              </radialGradient>
            </defs>
            <ellipse cx="70" cy="90" rx="42" ry="54" fill="url(#neg1)"/>
            <text x="70" y="98" text-anchor="middle" font-family="Noto Serif JP, serif" font-size="22" fill="#4a6878" opacity="0.5" letter-spacing="2">霊</text>
          </svg>` }} />

          {/* Message */}
          <p style={{
            fontSize: 14, color: 'var(--cream)', fontStyle: 'italic',
            lineHeight: 1.9, fontFamily: 'var(--font-body)',
          }}>
            {state.message}
          </p>

          <div className="mono" style={{
            fontSize: 8, color: 'var(--muted)', marginTop: 20,
            letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>
            speak to hermes to begin
          </div>
        </div>
      </div>
    )
  }

  // Format care log entries
  const careLog = (state?.care_log || []).slice().reverse().slice(0, 10)
  const journal = [] // journal entries will come from /api/journal later

  // Naming ceremony needed?
  const needsNaming = state && !state.named && state.evolution_stage !== 'egg' && !namingDismissed

  return (
    <div className="app-shell" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      padding: '24px 16px', gap: 12,
    }}>
      <ScanlineOverlay />

      {/* Naming ceremony overlay */}
      {needsNaming && (
        <NamingCeremony onComplete={() => setNamingDismissed(true)} />
      )}

      {/* Drift alert banner */}
      {driftAlert && (
        <div className="fade-in" style={{
          background: 'rgba(194,48,32,.08)', border: '1px solid rgba(194,48,32,.25)',
          borderRadius: 4, padding: '10px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: 'var(--vermilion)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            ⚠ Kokoro needs you
          </span>
          <button onClick={dismissDriftAlert} style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            cursor: 'pointer', fontSize: 14, padding: '0 4px',
          }}>×</button>
        </div>
      )}

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div className="label-xs" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span>妖怪ごっち</span>
            <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>Kokorogotchi</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, letterSpacing: '0.12em', fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
            {state?.name || 'Kokoro'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <ConnectionBadge status={connectionStatus} />
          <div style={{
            fontFamily: 'var(--font-label)', fontSize: 10, color: stage.color, marginTop: 4,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            transition: 'color 2s', fontWeight: 700,
          }}>
            {stage.label}
          </div>
        </div>
      </header>

      {/* Creature card */}
      <CreatureView state={state} />

      {/* Care action buttons */}
      <CareButtons
        state={state}
        connectionStatus={connectionStatus}
        performAction={performAction}
        isLoading={isLoading}
        lastResponse={lastResponse}
        cooldowns={cooldowns}
        canAct={canAct}
        actionsToday={actionsToday}
        hideResponse={chatMessages.length > 0}
      />

      {/* Chat thread + input */}
      <ChatThread messages={chatMessages} isLoading={isLoading} petName={state?.name || 'Kokoro'} />
      <ChatInput
        onSend={handleSendChat}
        canTalk={canAct('talk')}
        isLoading={isLoading}
        isOffline={connectionStatus === 'disconnected'}
        cooldown={cooldowns.talk || 0}
        petName={state?.name || 'Kokoro'}
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 2 }}>
        {[
          { id: 'memory', label: 'Memory' },
          { id: 'journal', label: 'Journal' },
          { id: 'stats', label: 'Stats' },
        ].map(a => (
          <button
            key={a.id}
            onClick={() => togglePanel(a.id)}
            style={{
              flex: 1, background: openPanel === a.id ? 'rgba(194,48,32,.08)' : 'transparent',
              border: openPanel === a.id ? '1px solid rgba(194,48,32,.25)' : '1px solid var(--border)',
              borderRadius: 4, padding: 10,
              fontFamily: 'var(--font-label)', fontSize: 9,
              letterSpacing: '0.35em', textTransform: 'uppercase',
              color: openPanel === a.id ? 'var(--cream)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.35s',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Memory panel */}
      {openPanel === 'memory' && (
        <div className="fade-in" style={{
          background: 'var(--faint)', border: '1px solid var(--border)',
          borderRadius: 4, padding: 13,
          display: 'flex', flexDirection: 'column', gap: 7,
        }}>
          <div className="mono" style={{
            fontSize: 9, letterSpacing: '0.35em',
            color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4,
          }}>Care Log</div>
          <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {careLog.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>no memories yet</div>
            ) : careLog.map((entry, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cream)',
                borderBottom: i < careLog.length - 1 ? '1px solid var(--border)' : 'none',
                paddingBottom: 6,
              }}>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 8, color: 'var(--muted)', marginBottom: 3, letterSpacing: '0.2em' }}>
                  {new Date(entry.at).toLocaleString()}
                </div>
                {entry.action}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Journal panel */}
      {openPanel === 'journal' && (
        <JournalTab name={state?.name} />
      )}

      {/* Stats panel */}
      {openPanel === 'stats' && (
        <StatsTab state={state} />
      )}

      {/* Footer */}
      <div className="mono" style={{
        fontSize: 8, color: '#ffffff18', letterSpacing: '0.16em',
        textTransform: 'uppercase', textAlign: 'center', marginTop: 'auto',
        paddingTop: 12,
      }}>
        it remembers everything
      </div>
    </div>
  )
}
