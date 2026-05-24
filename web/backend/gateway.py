"""Hermes gateway subprocess manager.

Spawns tui_gateway.entry as a child process, communicates via
JSON-RPC 2.0 over stdin/stdout (line-delimited).

Protocol (from research.md R-001):
  1. Spawn → wait for gateway.ready
  2. Send session.create → receive session_id
  3. Send prompt.submit → accumulate message.delta → message.complete
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path

log = logging.getLogger(__name__)

_HERMES_DIR = Path.home() / ".hermes" / "hermes-agent"
_PYTHON = _HERMES_DIR / "venv" / "bin" / "python3"

# Timeout for gateway ready event and session creation
_STARTUP_TIMEOUT = 15.0
# Timeout for care action response
_ACTION_TIMEOUT = 30.0


class GatewayError(Exception):
    pass


class GatewayManager:
    """Manages a persistent gateway subprocess and session."""

    def __init__(self) -> None:
        self._process: asyncio.subprocess.Process | None = None
        self._session_id: str | None = None
        self._msg_id: int = 0
        self._connected: bool = False
        self._lock = asyncio.Lock()
        self._read_lock = asyncio.Lock()

    @property
    def is_connected(self) -> bool:
        return self._connected and self._process is not None and self._process.returncode is None

    async def check_health(self) -> bool:
        """Check if the gateway subprocess is still alive. Returns False if crashed."""
        if not self._connected:
            return False
        if self._process is None or self._process.returncode is not None:
            self._connected = False
            self._session_id = None
            self._process = None
            return False
        return True

    async def reconnect(self) -> bool:
        """Attempt to reconnect after a crash. Returns True on success."""
        try:
            await self.connect()
            return True
        except Exception:
            log.warning("Gateway reconnect failed")
            return False

    async def connect(self) -> None:
        """Spawn gateway, wait for ready, create session."""
        async with self._lock:
            await self._cleanup()
            try:
                self._process = await asyncio.create_subprocess_exec(
                    str(_PYTHON), "-m", "tui_gateway.entry",
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.DEVNULL,
                    cwd=str(_HERMES_DIR),
                )
                # Wait for gateway.ready
                await self._wait_for_event("gateway.ready", timeout=_STARTUP_TIMEOUT)
                log.info("Gateway ready")

                # Create session
                self._msg_id += 1
                resp = await self._rpc("session.create", {"cols": 120})
                self._session_id = resp.get("result", {}).get("session_id")
                self._connected = True
                log.info("Session created: %s", self._session_id)
            except Exception:
                log.exception("Gateway connection failed")
                await self._cleanup()
                raise

    async def send_action(self, text: str) -> str:
        """Send a care action message, return the agent's accumulated response."""
        if not self.is_connected:
            raise GatewayError("Gateway not connected")

        self._msg_id += 1
        msg_id = self._msg_id
        await self._write({
            "jsonrpc": "2.0",
            "method": "prompt.submit",
            "params": {"session_id": self._session_id, "text": text},
            "id": msg_id,
        })

        # Accumulate message.delta content until message.complete
        response_parts: list[str] = []
        try:
            async with asyncio.timeout(_ACTION_TIMEOUT):
                while True:
                    event = await self._read_event()
                    if event is None:
                        raise GatewayError("Gateway process terminated")
                    etype = event.get("type", "")
                    if etype == "message.delta":
                        payload = event.get("payload", {})
                        content = payload.get("text", "") if isinstance(payload, dict) else ""
                        if content:
                            response_parts.append(content)
                    elif etype == "message.complete":
                        break
                    # Ignore message.start, tool.start, tool.complete, etc.
        except TimeoutError:
            raise GatewayError("Gateway response timed out")

        return "".join(response_parts)

    async def disconnect(self) -> None:
        """Shut down the gateway subprocess."""
        async with self._lock:
            await self._cleanup()

    # ── Internal helpers ─────────────────────────────────────────────

    async def _rpc(self, method: str, params: dict) -> dict:
        """Send a JSON-RPC request and wait for the matching response."""
        msg = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": self._msg_id,
        }
        await self._write(msg)

        async with asyncio.timeout(_STARTUP_TIMEOUT):
            while True:
                event = await self._read_event()
                if event is None:
                    raise GatewayError("Gateway process terminated during RPC")
                # JSON-RPC response has "id" matching our request
                if "id" in event and event["id"] == self._msg_id:
                    if "error" in event:
                        raise GatewayError(f"RPC error: {event['error']}")
                    return event

    async def _write(self, msg: dict) -> None:
        """Write a line-delimited JSON message to stdin."""
        if self._process is None or self._process.stdin is None:
            raise GatewayError("Gateway process not available")
        line = json.dumps(msg) + "\n"
        self._process.stdin.write(line.encode())
        await self._process.stdin.drain()

    async def _read_event(self) -> dict | None:
        """Read one line-delimited JSON event from stdout.

        Events may be top-level ({"type": "..."}) or wrapped in
        JSON-RPC envelope ({"jsonrpc": "2.0", "method": "event", "params": {"type": "..."}}).
        Normalize to a flat dict with "type" at the top level.
        """
        async with self._read_lock:
            if self._process is None or self._process.stdout is None:
                return None
            line = await self._process.stdout.readline()
            if not line:
                return None
            try:
                msg = json.loads(line)
            except json.JSONDecodeError:
                return {}
            # Unwrap JSON-RPC event envelope
            if msg.get("method") == "event" and "params" in msg:
                return msg["params"]
            # Unwrap JSON-RPC notification (method != "event" but has params.type)
            if "params" in msg and isinstance(msg["params"], dict) and "type" in msg["params"]:
                return msg["params"]
            return msg

    async def _wait_for_event(self, event_type: str, timeout: float) -> dict:
        """Read events until we see the expected type."""
        async with asyncio.timeout(timeout):
            while True:
                event = await self._read_event()
                if event is None:
                    raise GatewayError(f"Process died waiting for {event_type}")
                if event.get("type") == event_type:
                    return event

    async def _cleanup(self) -> None:
        """Kill the subprocess if still running."""
        self._connected = False
        self._session_id = None
        if self._process is not None:
            try:
                self._process.kill()
                await self._process.wait()
            except ProcessLookupError:
                pass
            self._process = None
