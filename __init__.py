"""
kokorogotchi/__init__.py
Registers the tools your agent uses to interact with Kokoro.
"""

import logging
from pathlib import Path
from . import schemas, tools

logger = logging.getLogger(__name__)


def register(ctx):
    """Wire Kokoro's caretaker tools into the Hermes plugin system."""

    # ── Tools ──────────────────────────────────────────────────────────────────

    ctx.register_tool(
        name="kokoro_read_state",
        toolset="kokorogotchi",
        schema=schemas.KOKORO_READ_STATE,
        handler=tools.kokoro_read_state,
        description="Read Kokoro's state, mood, stage, and time since last care.",
    )

    ctx.register_tool(
        name="kokoro_update_state",
        toolset="kokorogotchi",
        schema=schemas.KOKORO_UPDATE_STATE,
        handler=tools.kokoro_update_state,
        description="Update Kokoro's state after a care action.",
    )

    ctx.register_tool(
        name="kokoro_read_journal",
        toolset="kokorogotchi",
        schema=schemas.KOKORO_READ_JOURNAL,
        handler=tools.kokoro_read_journal,
        description="Read Kokoro's recent journal entries.",
    )

    ctx.register_tool(
        name="kokoro_write_journal",
        toolset="kokorogotchi",
        schema=schemas.KOKORO_WRITE_JOURNAL,
        handler=tools.kokoro_write_journal,
        description="Write a journal entry in Kokoro's voice.",
    )

    # ── Hooks ──────────────────────────────────────────────────────────────────

    def on_session_start(session_id, platform, **kwargs):
        logger.debug("[kokorogotchi] active — session %s on %s", session_id, platform)

    ctx.register_hook("on_session_start", on_session_start)

    logger.info("[kokorogotchi] Kokoro's tools are ready.")
