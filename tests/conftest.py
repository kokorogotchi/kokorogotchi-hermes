"""Shared fixtures for kokorogotchi tests.

Every test gets its own tmp directory — monkeypatched into tools module globals
so no test touches the real data/ directory.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

import pytest

import tools


@pytest.fixture(autouse=True)
def isolated_data(tmp_path, monkeypatch):
    """Redirect tools.STATE_FILE and tools.JOURNAL_FILE to tmp_path."""
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    monkeypatch.setattr(tools, "DATA_DIR", data_dir)
    monkeypatch.setattr(tools, "STATE_FILE", data_dir / "state.json")
    monkeypatch.setattr(tools, "JOURNAL_FILE", data_dir / "journal.json")
    return data_dir


def seed_state(data_dir: Path, **overrides) -> dict:
    """Write a state.json with sensible defaults, overridden by kwargs."""
    state = {
        "name": None,
        "gender": None,
        "named": False,
        "drift": 0.5,
        "mood": "neutral",
        "evolution_stage": "egg",
        "streak": 0,
        "days_missed": 0,
        "last_cared_at": None,
        "care_log": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    state.update(overrides)
    (data_dir / "state.json").write_text(json.dumps(state, indent=2), encoding="utf-8")
    return state


def seed_journal(data_dir: Path, entries: list[dict]) -> None:
    """Write a journal.json with the given entries."""
    (data_dir / "journal.json").write_text(json.dumps(entries, indent=2), encoding="utf-8")
