"""US6 — Journal read/write tests."""

import json
from datetime import datetime, timezone

import tools
from tests.conftest import seed_state, seed_journal


def test_empty_journal_read(isolated_data):
    """T025: Reading with no journal.json returns empty entries and a message."""
    seed_state(isolated_data, evolution_stage="hatchling", named=True, drift=0.5,
               last_cared_at=datetime.now(timezone.utc).isoformat(),
               care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.5}])
    result = json.loads(tools.kokoro_read_journal({}, ctx=None))
    assert result["entries"] == []
    assert "message" in result


def test_write_journal_entry(isolated_data):
    """T026: Writing a journal entry returns success."""
    seed_state(isolated_data, evolution_stage="hatchling", named=True, drift=0.5,
               last_cared_at=datetime.now(timezone.utc).isoformat(),
               care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.5}])
    result = json.loads(tools.kokoro_write_journal(
        {"entry": "warmth. something new."}, ctx=None
    ))
    assert result["success"] is True


def test_read_journal_with_limit(isolated_data):
    """T027: Reading with limit=3 returns at most 3 entries."""
    seed_state(isolated_data, evolution_stage="hatchling", named=True, drift=0.5,
               last_cared_at=datetime.now(timezone.utc).isoformat(),
               care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.5}])
    entries = [
        {"date": datetime.now(timezone.utc).isoformat(), "text": f"entry-{i}",
         "drift": 0.5, "written_autonomously": False}
        for i in range(5)
    ]
    seed_journal(isolated_data, entries)
    result = json.loads(tools.kokoro_read_journal({"limit": 3}, ctx=None))
    assert len(result["entries"]) == 3


def test_empty_entry_rejection(isolated_data):
    """T028: Writing an empty string returns success=false."""
    seed_state(isolated_data, evolution_stage="hatchling", named=True, drift=0.5,
               last_cared_at=datetime.now(timezone.utc).isoformat(),
               care_log=[{"at": datetime.now(timezone.utc).isoformat(), "action": "care", "drift": 0.5}])
    result = json.loads(tools.kokoro_write_journal({"entry": ""}, ctx=None))
    assert result["success"] is False
    assert "error" in result
