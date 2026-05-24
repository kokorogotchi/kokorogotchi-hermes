"""US2 — Streak-driven evolution stage progression tests.

Each test seeds state just below a threshold, then applies one care action
on the next consecutive day to push over it.
"""

import json
from datetime import datetime, timedelta, timezone

import tools
from tests.conftest import seed_state


def _yesterday() -> str:
    return (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()


def test_hatchling_evolves_to_pup(isolated_data):
    """T010: streak=2 + drift>0.60 + next-day care → pup."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        name="Luna",
        gender="female",
        streak=2,
        drift=0.61,
        last_cared_at=_yesterday(),
        care_log=[{"at": _yesterday(), "action": "care", "drift": 0.61}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "petted", "drift": 0.62}, ctx=None
    ))
    assert result["evolution_stage"] == "pup"


def test_pup_evolves_to_fledgling(isolated_data):
    """T011: streak=6 + drift>0.65 + next-day care → fledgling."""
    seed_state(
        isolated_data,
        evolution_stage="pup",
        named=True,
        name="Luna",
        gender="female",
        streak=6,
        drift=0.66,
        last_cared_at=_yesterday(),
        care_log=[{"at": _yesterday(), "action": "care", "drift": 0.66}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "played", "drift": 0.67}, ctx=None
    ))
    assert result["evolution_stage"] == "fledgling"


def test_fledgling_evolves_to_familiar(isolated_data):
    """T012: streak=29 + drift>0.75 + next-day care → familiar."""
    seed_state(
        isolated_data,
        evolution_stage="fledgling",
        named=True,
        name="Luna",
        gender="female",
        streak=29,
        drift=0.76,
        last_cared_at=_yesterday(),
        care_log=[{"at": _yesterday(), "action": "care", "drift": 0.76}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "groomed", "drift": 0.77}, ctx=None
    ))
    assert result["evolution_stage"] == "familiar"


def test_familiar_evolves_to_ethereal(isolated_data):
    """T013: streak=89 + drift>0.82 + next-day care → ethereal."""
    seed_state(
        isolated_data,
        evolution_stage="familiar",
        named=True,
        name="Luna",
        gender="female",
        streak=89,
        drift=0.83,
        last_cared_at=_yesterday(),
        care_log=[{"at": _yesterday(), "action": "care", "drift": 0.83}],
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "meditated", "drift": 0.84}, ctx=None
    ))
    assert result["evolution_stage"] == "ethereal"
