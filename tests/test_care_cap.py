"""US5 — Daily care cap and diminishing returns tests."""

import json
from datetime import datetime, timezone

import tools
from tests.conftest import seed_state


def _make_today_log(count: int) -> list[dict]:
    """Create count care_log entries timestamped today."""
    now = datetime.now(timezone.utc)
    return [
        {"at": now.isoformat(), "action": f"care-{i}", "drift": 0.5}
        for i in range(count)
    ]


def test_full_effect_first_three_actions(isolated_data):
    """T022: First 3 actions apply the full drift change."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        drift=0.5,
        streak=1,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=[],
    )
    # Apply 3 care actions, each raising drift
    for i in range(3):
        state = json.loads(tools.STATE_FILE.read_text(encoding="utf-8"))
        current_drift = state["drift"]
        target_drift = round(current_drift + 0.02, 4)
        result = json.loads(tools.kokoro_update_state(
            {"care_action": f"action-{i}", "drift": target_drift}, ctx=None
        ))
        assert result["success"] is True
        # Full effect: drift should match target (within rounding)
        assert abs(result["drift"] - target_drift) < 0.001, (
            f"Action {i}: expected drift ~{target_drift}, got {result['drift']}"
        )


def test_half_effect_on_actions_four_and_five(isolated_data):
    """T023: Actions 4-5 apply only half the drift delta."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        drift=0.5,
        streak=1,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=_make_today_log(3),  # 3 already done today
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "action-4", "drift": 0.6}, ctx=None
    ))
    assert result["success"] is True
    assert result.get("diminishing_returns") is True
    # Half effect: delta was 0.10, half is 0.05 → 0.55
    assert abs(result["drift"] - 0.55) < 0.001


def test_saturation_after_five_actions(isolated_data):
    """T024: After 5 actions today, drift no longer changes."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        drift=0.5,
        streak=1,
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        care_log=_make_today_log(5),  # 5 already done today
    )
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "action-6", "drift": 0.7}, ctx=None
    ))
    assert result.get("care_saturated") is True
    # Drift should not have changed
    state = json.loads(tools.STATE_FILE.read_text(encoding="utf-8"))
    assert state["drift"] == 0.5
