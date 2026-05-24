import React from 'react'
import { STAGES, PATHS, PATH_STAGES } from '../utils/stages'

/**
 * EvolutionMap — 3-column layout showing Growth, Neglect, Recovery paths.
 * Current stage is highlighted with glow.
 */
export default function EvolutionMap({ currentStage }) {
  const columns = [
    { key: 'growth', ...PATHS.growth, stages: PATH_STAGES.growth },
    { key: 'neglect', ...PATHS.neglect, stages: PATH_STAGES.neglect },
    { key: 'recovery', ...PATHS.recovery, stages: PATH_STAGES.recovery },
  ]

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {columns.map(col => (
        <div key={col.key} style={{ flex: col.key === 'recovery' ? 0.6 : 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Path header */}
          <div className="mono" style={{
            fontSize: 7, letterSpacing: '0.14em',
            color: col.color, textTransform: 'uppercase',
            textAlign: 'center', marginBottom: 4, opacity: 0.8,
          }}>
            {col.label}
          </div>

          {/* Stage nodes */}
          {col.stages.map((stageKey, idx) => {
            const stage = STAGES[stageKey]
            const isCurrent = stageKey === currentStage
            return (
              <div key={stageKey}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '6px 4px',
                  background: isCurrent ? '#ffffff0a' : 'transparent',
                  border: isCurrent ? `1px solid ${col.color}44` : '1px solid transparent',
                  borderRadius: 10,
                  opacity: isCurrent ? 1 : 0.4,
                  transition: 'all 0.5s',
                  boxShadow: isCurrent ? `0 0 12px ${col.color}22` : 'none',
                }}>
                  <span style={{ fontSize: 18 }}>{stage.emoji}</span>
                  <span className="mono" style={{
                    fontSize: 7, color: isCurrent ? col.color : '#ffffff88',
                    marginTop: 3, letterSpacing: '0.08em',
                  }}>
                    {stage.label}
                  </span>
                </div>
                {/* Connector line */}
                {idx < col.stages.length - 1 && (
                  <div style={{
                    width: 1, height: 8, margin: '0 auto',
                    background: `${col.color}33`,
                    borderLeft: `1px dotted ${col.color}33`,
                  }} />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
