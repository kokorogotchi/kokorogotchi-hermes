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
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScanlineOverlay />
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 48, animation: 'floatBob 2s ease-in-out infinite' }}>🥚</div>
          <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', marginTop: 16, letterSpacing: '0.1em' }}>
            connecting...
          </p>
        </div>
      </div>
    )
  }

  // No-state screen (state.json doesn't exist)
  if (state.error === 'no_state') {
    return (
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ScanlineOverlay />
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 24, filter: 'drop-shadow(0 0 20px #e8d5a333)' }}>🥚</div>
          <p style={{ fontSize: 13, color: '#ffffff88', fontStyle: 'italic', lineHeight: 1.9, maxWidth: 260 }}>
            {state.message}
          </p>
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
          background: '#e8a3c822', border: '1px solid #e8a3c844',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#e8a3c8' }}>
            ⚠ Kokoro needs you
          </span>
          <button onClick={dismissDriftAlert} style={{
            background: 'none', border: 'none', color: '#ffffff44',
            cursor: 'pointer', fontSize: 14, padding: '0 4px',
          }}>×</button>
        </div>
      )}

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div className="label-xs">Kokorogotchi こころごっち</div>
          <div style={{ fontSize: 22, fontWeight: 300, marginTop: 2, letterSpacing: '0.04em' }}>
            {state?.name || 'Kokoro'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <ConnectionBadge status={connectionStatus} />
          <div className="mono" style={{
            fontSize: 12, color: stage.color, marginTop: 3,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'color 2s',
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
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { id: 'memory', label: 'Memory' },
          { id: 'journal', label: 'Journal' },
          { id: 'stats', label: 'Stats' },
        ].map(a => (
          <button
            key={a.id}
            onClick={() => togglePanel(a.id)}
            style={{
              flex: 1, background: 'transparent',
              border: openPanel === a.id ? '1px solid #ffffff22' : '1px solid var(--border)',
              borderRadius: 12, padding: 10,
              fontFamily: 'var(--font-mono)', fontSize: 8,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: openPanel === a.id ? '#ffffff88' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.2s',
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
          borderRadius: 16, padding: 13,
          display: 'flex', flexDirection: 'column', gap: 7,
        }}>
          <div className="mono" style={{
            fontSize: 8, letterSpacing: '0.16em',
            color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4,
          }}>Care Log</div>
          <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {careLog.length === 0 ? (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ffffff28' }}>no memories yet</div>
            ) : careLog.map((entry, i) => (
              <div key={i} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ffffff44',
                borderBottom: i < careLog.length - 1 ? '1px solid #ffffff07' : 'none',
                paddingBottom: 6,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#ffffff33', marginBottom: 3 }}>
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
