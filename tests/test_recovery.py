"""US4 — Void-to-scarred recovery tests."""

import json
from datetime import datetime, timezone

import tools
from tests.conftest import seed_state


def test_void_recovers_to_scarred(isolated_data):
    """T020: Void creature with drift raised above 0.3 → scarred."""
    seed_state(
        isolated_data,
        evolution_stage="void",
        named=True,
        drift=0.25,
        streak=0,
        days_missed=30,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.25}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "came back", "drift": 0.35}, ctx=None
    ))
    assert result["evolution_stage"] == "scarred"


def test_phantom_does_not_become_scarred(isolated_data):
    """T021: Phantom creature with drift above 0.3 does NOT become scarred."""
    seed_state(
        isolated_data,
        evolution_stage="phantom",
        named=True,
        drift=0.25,
        streak=0,
        days_missed=15,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.25}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "came back", "drift": 0.35}, ctx=None
    ))
    assert result["evolution_stage"] != "scarred"
