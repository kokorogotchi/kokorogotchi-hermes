import React from 'react'
import { STAGES, PATHS } from '../utils/stages'
import DriftMeter from './DriftMeter'

/**
 * Main creature display — sleek card with emoji, name, meter, stats.
 */
export default function CreatureView({ state }) {
  if (!state) return null

  const stage = STAGES[state.evolution_stage] || STAGES.egg
  const pathInfo = PATHS[stage.path] || PATHS.start

  return (
    <div className="card fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 18, padding: '22px 20px 20px',
    }}>
      {/* Stage emoji with soft glow */}
      <div className="float-anim" style={{
        fontSize: 72, lineHeight: 1, userSelect: 'none',
        filter: `drop-shadow(0 0 18px ${stage.color}44) drop-shadow(0 0 40px ${stage.color}22)`,
        transition: 'filter 2s ease',
      }}>
        {stage.emoji}
      </div>

      {/* Drift meter */}
      <DriftMeter drift={state.drift ?? 0} />

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 8, width: '100%',
      }}>
        <StatBox label="Streak" value={`${state.streak ?? 0}d`} />
        <StatBox label="Mood" value={state.mood || 'neutral'} />
        <StatBox label="Missed" value={`${state.days_missed ?? 0}d`} />
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="stat">
      <div className="slabel">{label}</div>
      <div className="sval">{value}</div>
    </div>
  )
}
