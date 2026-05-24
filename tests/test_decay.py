"""US3 — Neglect drift decay and negative evolution stages.

Tests seed last_cared_at to a known past timestamp and rely on real
datetime.now() — decay math is deterministic from the timestamp delta.
"""

import json
from datetime import datetime, timedelta, timezone

import tools
from tests.conftest import seed_state


def _days_ago(n: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=n)).isoformat()


def test_grace_period_no_decay_within_one_day(isolated_data):
    """T014: Drift unchanged when last care was 1 day ago (grace period)."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        drift=0.5,
        streak=1,
        last_cared_at=_days_ago(1),
        care_log=[{"at": _days_ago(1), "action": "care", "drift": 0.5}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["drift"] == 0.5


def test_decay_rate_past_grace(isolated_data):
    """T015: 3 days ago = 2 days past grace → drift drops by 0.10."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        drift=0.5,
        streak=5,
        days_missed=0,
        last_cared_at=_days_ago(3),
        care_log=[{"at": _days_ago(3), "action": "care", "drift": 0.5}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["drift"] == 0.4
    assert result["streak"] == 0


def test_stray_stage(isolated_data):
    """T016: drift < 0.42 → stage is stray."""
    seed_state(
        isolated_data,
        named=True,
        drift=0.41,
        streak=0,
        days_missed=5,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.41}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "stray"


def test_feral_stage(isolated_data):
    """T017: drift < 0.35 → stage is feral."""
    seed_state(
        isolated_data,
        named=True,
        drift=0.34,
        streak=0,
        days_missed=10,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.34}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "feral"


def test_phantom_stage(isolated_data):
    """T018: drift < 0.20 → stage is phantom."""
    seed_state(
        isolated_data,
        named=True,
        drift=0.19,
        streak=0,
        days_missed=15,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.19}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "phantom"


def test_void_stage(isolated_data):
    """T019: drift < 0.12 and days_missed > 25 → stage is void."""
    seed_state(
        isolated_data,
        named=True,
        drift=0.11,
        streak=0,
        days_missed=26,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.11}],
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "void"
