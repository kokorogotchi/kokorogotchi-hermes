"""Tests for tone_hint in kokoro_read_state — FR-015, SC-009."""

import json
from datetime import datetime, timezone

import pytest

import tools
from tests.conftest import seed_state


@pytest.mark.parametrize(
    "stage, expected_tone, state_overrides",
    [
        # ── Start ──
        ("egg", "silent", {}),
        # ── Growth path ──
        (
            "hatchling",
            "innocent",
            {
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.5}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
                "named": True,
                "name": "Test",
            },
        ),
        (
            "pup",
            "curious",
            {
                "streak": 5,
                "drift": 0.65,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.65}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "fledgling",
            "playful",
            {
                "streak": 10,
                "drift": 0.70,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.70}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "familiar",
            "warm",
            {
                "streak": 35,
                "drift": 0.80,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.80}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "ethereal",
            "transcendent",
            {
                "streak": 95,
                "drift": 0.90,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.90}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        # ── Neglect path ──
        (
            "stray",
            "guarded",
            {
                "drift": 0.41,
                "days_missed": 3,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.41}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "feral",
            "aggressive",
            {
                "drift": 0.34,
                "days_missed": 5,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.34}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "phantom",
            "hollow",
            {
                "drift": 0.19,
                "days_missed": 10,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.19}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        (
            "void",
            "absent",
            {
                "drift": 0.11,
                "days_missed": 26,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.11}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
        # ── Recovery path ──
        (
            "scarred",
            "weathered",
            {
                "evolution_stage": "void",
                "drift": 0.35,
                "days_missed": 30,
                "care_log": [{"at": datetime.now(timezone.utc).isoformat(), "action": "visit", "drift": 0.35}],
                "last_cared_at": datetime.now(timezone.utc).isoformat(),
            },
        ),
    ],
    ids=[
        "egg-silent",
        "hatchling-innocent",
        "pup-curious",
        "fledgling-playful",
        "familiar-warm",
        "ethereal-transcendent",
        "stray-guarded",
        "feral-aggressive",
        "phantom-hollow",
        "void-absent",
        "scarred-weathered",
    ],
)
def test_tone_hint(isolated_data, stage, expected_tone, state_overrides):
    """kokoro_read_state returns the correct tone_hint for each evolution stage."""
    seed_state(isolated_data, **state_overrides)
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == stage, (
        f"Expected stage {stage!r}, got {result['evolution_stage']!r}"
    )
    assert result["tone_hint"] == expected_tone
