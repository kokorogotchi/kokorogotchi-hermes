import React from 'react'
import { STAGES, PATHS } from '../utils/stages'
import { SPRITES } from '../utils/sprites'
import DriftMeter from './DriftMeter'

/**
 * Main creature display — sleek card with yokai SVG, name, meter, stats.
 */
export default function CreatureView({ state }) {
  if (!state) return null

  const stageKey = state.evolution_stage || 'egg'
  const stage = STAGES[stageKey] || STAGES.egg
  const pathInfo = PATHS[stage.path] || PATHS.start
  const sprite = SPRITES[stageKey] || SPRITES.egg

  return (
    <div className="card fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 18, padding: '22px 20px 20px',
    }}>
      {/* Yokai SVG sprite with soft glow */}
      <div className="float-anim" style={{
        width: 140, height: 160, userSelect: 'none',
        filter: `drop-shadow(0 0 18px ${stage.color}44) drop-shadow(0 0 40px ${stage.color}22)`,
        transition: 'filter 2s ease',
      }} dangerouslySetInnerHTML={{ __html: sprite }} />

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
