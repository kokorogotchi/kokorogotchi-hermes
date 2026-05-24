/**
 * Evolution stage definitions — mirrors tools.py _TONE_HINTS and _compute_evolution.
 * Emojis and colors inspired by examples/kokorogotchi-ui-example1.jsx.
 */

export const STAGES = {
  egg:       { emoji: "🥚", label: "Egg",       path: "start",    tone: "silent",       color: "#b8c4d0" },
  hatchling: { emoji: "🐣", label: "Hatchling", path: "growth",   tone: "innocent",     color: "#fde68a" },
  pup:       { emoji: "🐾", label: "Pup",       path: "growth",   tone: "curious",      color: "#86efac" },
  fledgling: { emoji: "🪶", label: "Fledgling", path: "growth",   tone: "playful",      color: "#67e8f9" },
  familiar:  { emoji: "🤝", label: "Familiar",  path: "growth",   tone: "warm",         color: "#fca5a5" },
  ethereal:  { emoji: "✨", label: "Ethereal",  path: "growth",   tone: "transcendent", color: "#e9d5ff" },
  stray:     { emoji: "😿", label: "Stray",     path: "neglect",  tone: "guarded",      color: "#d1d5db" },
  feral:     { emoji: "🐺", label: "Feral",     path: "neglect",  tone: "aggressive",   color: "#fca5a5" },
  phantom:   { emoji: "👻", label: "Phantom",   path: "neglect",  tone: "hollow",       color: "#c4b5fd" },
  void:      { emoji: "🕳️", label: "Void",      path: "neglect",  tone: "absent",       color: "#374151" },
  scarred:   { emoji: "🩹", label: "Scarred",   path: "recovery", tone: "weathered",    color: "#d97706" },
};

/** Path display metadata */
export const PATHS = {
  start:    { label: "Origin",   color: "#b8c4d0" },
  growth:   { label: "Growth",   color: "#4ade80" },
  neglect:  { label: "Neglect",  color: "#f87171" },
  recovery: { label: "Recovery", color: "#fbbf24" },
};

/** Ordered stage lists per path (for evolution map rendering) */
export const PATH_STAGES = {
  growth:   ["egg", "hatchling", "pup", "fledgling", "familiar", "ethereal"],
  neglect:  ["stray", "feral", "phantom", "void"],
  recovery: ["scarred"],
};

/** Care action definitions */
export const CARE_ACTIONS = [
  { id: "feed", label: "Feed", icon: "🍎", message: "I want to feed Kokoro" },
  { id: "play", label: "Play", icon: "🎮", message: "I want to play with Kokoro" },
  { id: "talk", label: "Talk", icon: "💬", message: "I want to talk to Kokoro" },
  { id: "rest", label: "Rest", icon: "💤", message: "Let Kokoro rest" },
];

/** Drift meter color thresholds */
export const DRIFT_COLORS = {
  low:    "#f87171",  // 0.0–0.3 red
  mid:    "#fbbf24",  // 0.3–0.6 yellow
  high:   "#4ade80",  // 0.6–1.0 green
};
