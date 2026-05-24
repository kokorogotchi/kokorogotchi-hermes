"""US1 — Egg hatching and naming ceremony tests.

Also contains foundational edge-case tests (T003, T004) since they
exercise the same first-visit code paths.
"""

import json
from datetime import datetime, timezone

import tools
from tests.conftest import seed_state


# ── Foundational (T003, T004) ──────────────────────────────────────────────────


def test_corrupted_state_falls_back_to_defaults(isolated_data):
    """T003: A corrupted state.json produces a clean default egg state."""
    (isolated_data / "state.json").write_text("{{not json!!", encoding="utf-8")
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "egg"
    assert result["drift"] == 0.5
    assert result["first_visit"] is True


def test_data_directory_created_when_missing(tmp_path, monkeypatch):
    """T004: data directory is auto-created if it doesn't exist."""
    missing_dir = tmp_path / "nonexistent" / "data"
    monkeypatch.setattr(tools, "DATA_DIR", missing_dir)
    monkeypatch.setattr(tools, "STATE_FILE", missing_dir / "state.json")
    monkeypatch.setattr(tools, "JOURNAL_FILE", missing_dir / "journal.json")
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "egg"
    assert missing_dir.exists()


# ── US1: Egg Hatching & Naming Ceremony (T005-T009) ───────────────────────────


def test_first_visit_creates_egg_state(isolated_data):
    """T005: First read with no state.json produces an egg with drift=0.5."""
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert result["evolution_stage"] == "egg"
    assert result["drift"] == 0.5
    assert result["first_visit"] is True
    assert "name" not in result  # name is None, so omitted


def test_care_action_hatches_egg_to_hatchling(isolated_data):
    """T006: A care action on an egg hatches it to hatchling."""
    # Create the egg first
    tools.kokoro_read_state({}, ctx=None)
    # Now care for it
    result = json.loads(tools.kokoro_update_state(
        {"care_action": "fed the egg", "drift": 0.58}, ctx=None
    ))
    assert result["success"] is True
    assert result["evolution_stage"] == "hatchling"


def test_naming_ceremony_triggers_for_unnamed_hatchling(isolated_data):
    """T007: Reading state of an unnamed hatchling returns naming_ceremony."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=False,
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "hatched", "drift": 0.5}],
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        streak=1,
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert "naming_ceremony" in result


def test_naming_ceremony_completes(isolated_data):
    """T008: Providing name and gender sets named=true."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=False,
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "hatched", "drift": 0.5}],
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        streak=1,
    )
    result = json.loads(tools.kokoro_update_state(
        {"name": "Luna", "gender": "female"}, ctx=None
    ))
    assert result["success"] is True

    # Verify persisted state
    state = json.loads(tools.STATE_FILE.read_text(encoding="utf-8"))
    assert state["named"] is True
    assert state["name"] == "Luna"
    assert state["gender"] == "female"


def test_naming_ceremony_does_not_retrigger(isolated_data):
    """T009: After naming, reading state omits naming_ceremony and includes name."""
    seed_state(
        isolated_data,
        evolution_stage="hatchling",
        named=True,
        name="Luna",
        gender="female",
        care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "hatched", "drift": 0.5}],
        last_cared_at=datetime.now(timezone.utc).isoformat(),
        streak=1,
    )
    result = json.loads(tools.kokoro_read_state({}, ctx=None))
    assert "naming_ceremony" not in result
    assert result["name"] == "Luna"
    assert result["gender"] == "female"
