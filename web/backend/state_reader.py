"""Read-only access to Kokoro's state and journal files.

The sidecar NEVER writes to these files — all mutations flow
through the Hermes agent tool handlers (Constitution III).
"""

from __future__ import annotations

import json
from pathlib import Path

# Resolve data directory relative to the plugin root
_PLUGIN_DIR = Path(__file__).resolve().parent.parent.parent
STATE_FILE = _PLUGIN_DIR / "data" / "state.json"
JOURNAL_FILE = _PLUGIN_DIR / "data" / "journal.json"

_NO_STATE = {
    "error": "no_state",
    "message": "Kokoro hasn't been born yet. Start the Hermes agent to create an egg.",
}


def read_state() -> tuple[dict, bool]:
    """Return (state_dict, found).

    If state.json is missing or unreadable, returns (_NO_STATE, False).
    """
    try:
        data = json.loads(STATE_FILE.read_text(encoding="utf-8"))
        return data, True
    except (FileNotFoundError, json.JSONDecodeError):
        return _NO_STATE, False


def read_journal(limit: int = 10, offset: int = 0) -> dict:
    """Return paginated journal entries (newest first).

    Returns {"entries": [...], "total": int, "has_more": bool}.
    """
    try:
        entries = json.loads(JOURNAL_FILE.read_text(encoding="utf-8"))
        if not isinstance(entries, list):
            entries = []
    except (FileNotFoundError, json.JSONDecodeError):
        entries = []

    total = len(entries)
    if total == 0:
        return {
            "entries": [],
            "total": 0,
            "has_more": False,
            "message": "Kokoro hasn't written anything yet.",
        }

    # Entries are already newest-first in journal.json
    page = entries[offset : offset + limit]
    return {
        "entries": page,
        "total": total,
        "has_more": (offset + limit) < total,
    }
