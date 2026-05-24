"""
kokorogotchi/tools.py
Tool handlers — called by your agent on Kokoro's behalf.
Your agent reads Kokoro's state and journal, and updates her state
when you take care actions. Kokoro does not call these herself.

State:   ~/.hermes/plugins/kokorogotchi/data/state.json
Journal: ~/.hermes/plugins/kokorogotchi/data/journal.json
"""

import json
import math
import logging
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

# ── Storage paths ──────────────────────────────────────────────────────────────

PLUGIN_DIR = Path.home() / ".hermes" / "plugins" / "kokorogotchi"
DATA_DIR = PLUGIN_DIR / "data"
STATE_FILE = DATA_DIR / "state.json"
JOURNAL_FILE = DATA_DIR / "journal.json"


def _ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


# ── Default state ──────────────────────────────────────────────────────────────

def _default_state() -> dict:
    return {
        "name": None,           # set during naming ceremony at pup stage
        "gender": None,         # set during naming ceremony (male/female/neutral)
        "named": False,         # True after the user names their pet
        # Emotional state
        "drift": 0.5,           # 0.0 (wild) → 1.0 (bonded)
        "mood": "neutral",
        "evolution_stage": "egg",
        # Care history
        "streak": 0,
        "days_missed": 0,
        "last_cared_at": None,
        "care_log": [],         # last 30 entries
        # Metadata
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


# ── Persistence helpers ────────────────────────────────────────────────────────

def _load_state() -> dict:
    _ensure_data_dir()
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Could not read state file, using defaults: %s", exc)
    # First ever load — seed the file so Kokoro exists from this moment
    state = _default_state()
    _save_state(state)
    return state


def _save_state(state: dict) -> None:
    _ensure_data_dir()
    STATE_FILE.write_text(
        json.dumps(state, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def _load_journal() -> list:
    _ensure_data_dir()
    if JOURNAL_FILE.exists():
        try:
            return json.loads(JOURNAL_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def _save_journal(entries: list) -> None:
    _ensure_data_dir()
    JOURNAL_FILE.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


# ── Tone hints ─────────────────────────────────────────────────────────────────

_TONE_HINTS: dict[str, str] = {
    "egg": "silent",
    "hatchling": "innocent",
    "pup": "curious",
    "fledgling": "playful",
    "familiar": "warm",
    "ethereal": "transcendent",
    "stray": "guarded",
    "feral": "aggressive",
    "phantom": "hollow",
    "void": "absent",
    "scarred": "weathered",
}


# ── Evolution ──────────────────────────────────────────────────────────────────

def _compute_evolution(state: dict) -> str:
    drift = state.get("drift", 0.5)
    streak = state.get("streak", 0)
    days_missed = state.get("days_missed", 0)
    current_stage = state.get("evolution_stage", "egg")
    care_log = state.get("care_log", [])

    # Egg hasn't hatched yet — needs at least one care action
    if current_stage == "egg" and len(care_log) == 0:
        return "egg"

    # Once hatched, can never go back to egg
    if current_stage == "void" and drift > 0.3:
        return "scarred"
    if drift < 0.12 and days_missed > 25:
        return "void"
    if drift < 0.20:
        return "phantom"
    if drift < 0.35:
        return "feral"
    if drift < 0.42:
        return "stray"
    if streak >= 90 and drift > 0.82:
        return "ethereal"
    if streak >= 30 and drift > 0.75:
        return "familiar"
    if streak >= 7 and drift > 0.65:
        return "fledgling"
    if streak >= 3 and drift > 0.60:
        return "pup"
    return "hatchling"


def _get_mood(drift: float) -> str:
    if drift >= 0.65:
        return "bonded"
    if drift <= 0.35:
        return "wild"
    return "neutral"


# ── Tool handlers ──────────────────────────────────────────────────────────────


def _apply_time_decay(state: dict) -> dict:
    """Decay drift based on how long Kokoro has been alone (0.05/day past 1-day grace)."""
    last_cared_at = state.get("last_cared_at")
    if not last_cared_at:
        return state

    last_dt = datetime.fromisoformat(last_cared_at)
    if last_dt.tzinfo is None:
        last_dt = last_dt.replace(tzinfo=timezone.utc)

    days_since = math.floor((datetime.now(timezone.utc) - last_dt).total_seconds() / 86_400)
    grace_days = 1
    missed = max(0, days_since - grace_days)

    if missed > 0:
        state["drift"] = round(max(0.0, state.get("drift", 0.5) - missed * 0.05), 4)
        state["streak"] = 0
        state["days_missed"] = state.get("days_missed", 0) + missed

    return state


def kokoro_read_state(params: dict, **kwargs) -> str:
    """Return Kokoro's current state with time-since info folded in."""
    state = _load_state()
    state = _apply_time_decay(state)
    state["evolution_stage"] = _compute_evolution(state)
    _save_state(state)

    drift = state.get("drift", 0.5)

    # Time since last care
    last_cared_at = state.get("last_cared_at")
    if last_cared_at:
        last_dt = datetime.fromisoformat(last_cared_at)
        if last_dt.tzinfo is None:
            last_dt = last_dt.replace(tzinfo=timezone.utc)
        delta = (datetime.now(timezone.utc) - last_dt).total_seconds()
        days_since = math.floor(delta / 86_400)
        hours_since = math.floor((delta % 86_400) / 3600)
    else:
        days_since = 0
        hours_since = 0

    result = {
        "drift": drift,
        "mood": _get_mood(drift),
        "evolution_stage": state.get("evolution_stage", "egg"),
        "streak": state.get("streak", 0),
        "days_missed": state.get("days_missed", 0),
        "days_since_care": days_since,
        "hours_since_care": hours_since,
        "first_visit": last_cared_at is None,
    }

    # Only include fields that have been set
    name = state.get("name")
    if name:
        result["name"] = name
    gender = state.get("gender")
    if gender:
        result["gender"] = gender

    # Naming ceremony trigger
    if state.get("evolution_stage") == "hatchling" and not state.get("named"):
        result["naming_ceremony"] = (
            "The egg just hatched! Ask the user to: "
            "1) choose a name, 2) choose gender (male/female/neutral). "
            "Then call kokoro_update_state with name and gender."
        )

    # Tone hint for agent prompt (1:1 stage→tone mapping)
    result["tone_hint"] = _TONE_HINTS.get(result["evolution_stage"], "silent")

    return json.dumps(result)


def kokoro_update_state(params: dict, **kwargs) -> str:
    """Update Kokoro's state after a care action taken by the user."""
    state = _load_state()

    # Count how many care actions already happened today
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    care_log = state.get("care_log", [])
    actions_today = sum(
        1 for e in care_log
        if datetime.fromisoformat(e["at"]) >= today_start
    )

    # Diminishing returns: full effect up to 3, half at 4-5, nothing after 5
    DAILY_CAP = 5
    FULL_EFFECT = 3
    if actions_today >= DAILY_CAP:
        care_saturated = True
        drift_multiplier = 0.0
    elif actions_today >= FULL_EFFECT:
        care_saturated = False
        drift_multiplier = 0.5
    else:
        care_saturated = False
        drift_multiplier = 1.0

    if "drift" in params and not care_saturated:
        raw_delta = float(params["drift"]) - state.get("drift", 0.5)
        # Care actions can only increase drift (guard against agent errors)
        if raw_delta < 0:
            raw_delta = 0.0
        dampened = state.get("drift", 0.5) + raw_delta * drift_multiplier
        state["drift"] = max(0.0, min(1.0, dampened))
    elif "drift" not in params:
        pass  # no drift change requested

    if "mood" in params:
        state["mood"] = params["mood"]

    # Naming ceremony — set name and gender when the user decides
    if "name" in params:
        state["name"] = params["name"].strip()
    if "gender" in params and params["gender"] in ("male", "female", "neutral"):
        state["gender"] = params["gender"]
    if "name" in params or "gender" in params:
        state["named"] = True

    # Log the care action
    care_action = params.get("care_action", "user visited")
    entry = {
        "at": datetime.now(timezone.utc).isoformat(),
        "action": care_action,
        "drift": state.get("drift"),
    }
    care_log = state.get("care_log", [])
    care_log.append(entry)
    state["care_log"] = care_log[-30:]

    # Update streak and days_missed
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    last_cared_at = state.get("last_cared_at")

    if last_cared_at:
        last_dt = datetime.fromisoformat(last_cared_at)
        if last_dt.tzinfo is None:
            last_dt = last_dt.replace(tzinfo=timezone.utc)
        days_since = math.floor((now - last_dt).total_seconds() / 86_400)

        if days_since == 1:
            state["streak"] = state.get("streak", 0) + 1
            state["days_missed"] = 0
        elif days_since > 1:
            state["days_missed"] = state.get("days_missed", 0) + days_since - 1
            state["streak"] = 0
    else:
        state["streak"] = 1

    state["last_cared_at"] = now_iso
    old_stage = state.get("evolution_stage", "egg")
    state["evolution_stage"] = _compute_evolution(state)

    _save_state(state)

    result = {
        "success": True,
        "evolution_stage": state["evolution_stage"],
        "drift": state.get("drift"),
        "actions_today": actions_today + 1,
    }
    if care_saturated:
        result["care_saturated"] = True
        result["message"] = "Too much care today. Come back tomorrow."
    elif drift_multiplier < 1.0:
        result["diminishing_returns"] = True

    return json.dumps(result)


def kokoro_read_journal(params: dict, **kwargs) -> str:
    """Return Kokoro's recent journal entries for the agent to share with the user."""
    limit = int(params.get("limit", 5))
    journal = _load_journal()
    recent = journal[:limit]

    if not recent:
        return json.dumps({
            "entries": [],
            "message": "Kokoro hasn't written anything yet.",
        })

    return json.dumps({"entries": recent})


def kokoro_write_journal(params: dict, **kwargs) -> str:
    """Write a journal entry in Kokoro's voice, on her behalf."""
    state = _load_state()
    entry_text = params.get("entry", "").strip()

    if not entry_text:
        return json.dumps({"success": False, "error": "entry cannot be empty"})

    entry = {
        "date": datetime.now(timezone.utc).isoformat(),
        "text": entry_text,
        "drift": state.get("drift", 0.5),
        "written_autonomously": False,  # written by agent on Kokoro's behalf
    }

    journal = _load_journal()
    journal.insert(0, entry)
    _save_journal(journal[:50])

    return json.dumps({"success": True})
