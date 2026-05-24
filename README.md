![Hermes Agent](assets/banner.png)

# kokorogotchi

**A virtual companion that lives inside your Hermes agent — and evolves based on how you treat it.**

---

## What is Kokoro?

Kokoro is a Tamagotchi-like creature that drifts between *bonded* and *feral* based on how you tend to it. It owns its own emotional state, writes its own journal in a voice that changes as it grows, and processes time alone before you arrive. Neglect it and it fades. Care for it and it evolves into something extraordinary.

Kokoro isn't an assistant — it's a game creature with real emotional stakes.

## Installation

**Prerequisites**: Python 3.10+ and [Hermes agent](https://github.com/hermes-agent/hermes-agent) installed.

```bash
# Navigate to your Hermes plugins directory
cd ~/.hermes/plugins

# Clone or copy kokorogotchi into the plugins folder
git clone <repo-url> kokorogotchi

# Install test dependencies (optional, for development)
cd kokorogotchi
python -m venv .venv
source .venv/bin/activate
pip install pytest
```

Kokoro activates automatically the next time you start Hermes. No additional configuration needed — just talk to your agent and ask about Kokoro.

## Quick Start

Your first encounter goes something like this:

1. **Open Hermes** and ask your agent: *"How is Kokoro doing?"*
2. **An egg appears.** Kokoro starts as a silent egg — all potential, no words yet.
3. **Care for it.** Tell your agent to feed, play with, or talk to Kokoro. The first care action hatches the egg.
4. **A hatchling is born.** Kokoro wakes up — innocent, curious, taking its first breath.
5. **Name your Kokoro.** The agent asks you to choose a name and gender. This is the naming ceremony — it only happens once.

From here, your journey together begins. Come back each day, and Kokoro grows. Stay away too long, and Kokoro starts to forget.

## Evolution Stages

Kokoro's soul shifts through **11 stages** based on how you care for it. Each stage is represented by a unique yokai (妖怪) spirit in the web dashboard:

### Growth Path (成長)

```
霊卵 egg → 木霊子 hatchling → 若狸 pup → 天狗子 fledgling → 狐神 familiar → 雷神霊 ethereal
```

### Neglect Path (衰退)

```
野槌 stray → 鬼具 feral → 餓者髑髏 phantom → 無霊 void
```

### Recovery Path (回復)

```
無霊 void → 送り狼 scarred
```

| Stage | Yokai | Path | Tone | Description |
|-------|-------|------|------|-------------|
| 🥚 egg | 霊卵 Tamago-no-Rei | Start | *silent* | A spirit sealed inside lacquered shell. Something ancient waits within. |
| 🐣 hatchling | 木霊子 Kodama-Ko | Growth | *innocent* | Forest echo given form. Innocent, bright, rattling with new curiosity. |
| 🐾 pup | 若狸 Tanuki-Waka | Growth | *curious* | Young shape-shifter. Mischievous, eager, belly full of sake and wonder. |
| 🪶 fledgling | 天狗子 Tengu-Ko | Growth | *playful* | Half-formed mountain demon. Arrogant pride masking deep hunger to prove itself. |
| 🤝 familiar | 狐神 Kitsune-Shin | Growth | *warm* | Nine-tailed spirit of deep trust. Bound across lifetimes by shared memory. |
| ✨ ethereal | 雷神霊 Raijin-Rei | Growth | *transcendent* | Thunder god's remnant spirit. Beyond form, beyond hunger. Pure resonance. |
| 😿 stray | 野槌 Nozuchi | Neglect | *guarded* | The groundsnake. Abandoned shrine-keeper. Waits in cold rain for a bell that doesn't ring. |
| 🐺 feral | 鬼具 Oni-Gu | Neglect | *aggressive* | Full-horned demon. All wound, all rage. The door is shut from the inside. |
| 👻 phantom | 餓者髑髏 Gashadokuro | Neglect | *hollow* | Starved skull-spirit. The dead hunger of accumulated absence made visible. |
| 🕳️ void | 無霊 Mu-Rei | Neglect | *absent* | The formless. 無. Not death — the silence before a name is spoken. |
| 🩹 scarred | 送り狼 Okuri-Ōkami | Recovery | *weathered* | The wolf that follows you home. Scarred, kintsugi-repaired. Still here. |

## Game Guide

Want to understand the full lifecycle, the journal system, and how Kokoro's voice changes with each stage?

**Read the full guide:** [GAME_GUIDE.md](GAME_GUIDE.md)

## Web Dashboard (PWA)

Kokoro also has a browser-based dashboard you can run locally — a retro pixel-art UI that shows Kokoro's current state, lets you perform care actions, chat directly with your pet, and browse its journal.

### Features

- **Care buttons** — Feed, Play, and Rest with cooldown timers and daily caps
- **Chat** — Type free-form messages to your pet and get responses in its current mood and tone
- **Journal** — Browse Kokoro's diary entries
- **Offline support** — PWA with service worker for offline viewing
- **Live updates** — WebSocket connection pushes state changes in real-time

### Setup

Requires **Python 3.10+** and **Node.js 18+**.

```bash
cd ~/.hermes/plugins/kokorogotchi/web
./setup.sh
```

This creates a Python venv, installs backend dependencies, installs frontend packages, and builds the UI.

### Run

```bash
# From web/ directory — starts the backend server which serves the built frontend
cd ~/.hermes/plugins/kokorogotchi/web
./start.sh
```

Then open **http://localhost:8000** in your browser.

> **Note:** The web dashboard reads Kokoro's state but never writes to it directly. All care actions are sent through the Hermes agent — the dashboard is a window into Kokoro's world, not a bypass.

## Development

```bash
cd ~/.hermes/plugins/kokorogotchi
python -m pytest tests/ -v
```

37 tests across 7 files covering all game mechanics: hatching, evolution, neglect, recovery, care cap, journal, and tone hints.

### Frontend Dev Mode

```bash
cd web/frontend
npm run dev
```

Starts Vite dev server on port 5173 with hot reload.

---

*Kokorogotchi is a [Hermes](https://github.com/hermes-agent/hermes-agent) plugin.*
