"""FastAPI sidecar — routes, WebSocket broadcast, static file serving."""

from __future__ import annotations

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Query, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from .gateway import GatewayError, GatewayManager
from .state_reader import STATE_FILE, read_journal, read_state

log = logging.getLogger(__name__)

# ── Globals ──────────────────────────────────────────────────────────────────

gateway = GatewayManager()
connected_clients: set[WebSocket] = set()

_FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


# ── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start gateway connection and state file watcher on startup."""
    watcher_task = asyncio.create_task(_watch_state_file())
    # Try to connect gateway — non-fatal if it fails
    try:
        await gateway.connect()
    except Exception:
        log.warning("Gateway connection failed at startup — running in fallback mode")
    yield
    watcher_task.cancel()
    await gateway.disconnect()


# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(title="Kokorogotchi Sidecar", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── REST routes ──────────────────────────────────────────────────────────────

@app.get("/api/state")
async def api_state():
    state, found = read_state()
    if not found:
        # If gateway is connected, trigger egg creation by sending initial message
        if gateway.is_connected:
            try:
                await gateway.send_action("Check on Kokoro.")
            except Exception:
                pass
            # Re-read — the agent should have created state.json
            state, found = read_state()
            if found:
                state["gateway_connected"] = gateway.is_connected
                return JSONResponse(state)
        return JSONResponse(state, status_code=404)
    state["gateway_connected"] = gateway.is_connected
    return JSONResponse(state)


@app.post("/api/action")
async def api_action(request: Request):
    body = await request.json()
    action = body.get("action", "")
    valid_actions = ("feed", "play", "talk", "rest")
    if action not in valid_actions:
        return JSONResponse(
            {"error": "invalid_action", "message": f"Action must be one of: {', '.join(valid_actions)}"},
            status_code=422,
        )
    if not gateway.is_connected:
        return JSONResponse(
            {"error": "gateway_offline", "message": "Hermes agent is offline. Start the gateway to interact with Kokoro."},
            status_code=503,
        )
    state, _ = read_state()
    pet_name = state.get("name") or "Kokoro"
    messages = {
        "feed": f"I want to feed {pet_name}.",
        "play": f"I want to play with {pet_name}.",
        "talk": f"I want to talk to {pet_name}.",
        "rest": f"Let {pet_name} rest.",
    }
    try:
        response_text = await gateway.send_action(messages[action])
    except GatewayError as exc:
        if "timed out" in str(exc).lower():
            return JSONResponse(
                {"error": "gateway_timeout", "message": "Kokoro took too long to respond. Try again."},
                status_code=504,
            )
        return JSONResponse(
            {"error": "gateway_error", "message": str(exc)},
            status_code=502,
        )
    # Read updated state after action
    updated_state, _ = read_state()
    updated_state["gateway_connected"] = gateway.is_connected
    return JSONResponse({"success": True, "response": response_text, "state": updated_state})


@app.post("/api/name")
async def api_name(request: Request):
    """Naming ceremony — set Kokoro's name and gender."""
    body = await request.json()
    name = (body.get("name") or "").strip()
    gender = body.get("gender", "neutral")
    if not name:
        return JSONResponse({"error": "missing_name", "message": "Please provide a name."}, status_code=422)
    if gender not in ("male", "female", "neutral"):
        gender = "neutral"
    if not gateway.is_connected:
        return JSONResponse(
            {"error": "gateway_offline", "message": "Hermes agent is offline."},
            status_code=503,
        )
    prompt = f"The user wants to name Kokoro '{name}' with gender '{gender}'."
    try:
        response_text = await gateway.send_action(prompt)
    except GatewayError as exc:
        return JSONResponse({"error": "gateway_error", "message": str(exc)}, status_code=502)
    updated_state, _ = read_state()
    updated_state["gateway_connected"] = gateway.is_connected
    return JSONResponse({"success": True, "response": response_text, "state": updated_state})


@app.post("/api/chat")
async def api_chat(request: Request):
    """Free-form chat message to Kokoro. Counts as a 'talk' care action."""
    body = await request.json()
    message = (body.get("message") or "").strip()
    if not message or len(message) > 200:
        return JSONResponse(
            {"error": "invalid_message", "message": "Message must be 1-200 characters."},
            status_code=422,
        )
    if not gateway.is_connected:
        return JSONResponse(
            {"error": "gateway_offline", "message": "Hermes agent is offline. Start the gateway to interact with Kokoro."},
            status_code=503,
        )
    # Use the pet's actual name if it has been named
    state, _ = read_state()
    pet_name = state.get("name") or "Kokoro"
    mood = state.get("mood", "neutral")
    stage = state.get("evolution_stage", "egg")
    prompt = (
        f"The user says to {pet_name}: {message}\n"
        f"Respond as {pet_name} (mood: {mood}, stage: {stage}). "
        f"Stay in character — match the tone_hint for this stage."
    )
    try:
        response_text = await gateway.send_action(prompt)
    except GatewayError as exc:
        if "timed out" in str(exc).lower():
            return JSONResponse(
                {"error": "gateway_timeout", "message": "Kokoro took too long to respond. Try again."},
                status_code=504,
            )
        return JSONResponse(
            {"error": "gateway_error", "message": str(exc)},
            status_code=502,
        )
    updated_state, _ = read_state()
    updated_state["gateway_connected"] = gateway.is_connected
    return JSONResponse({"success": True, "response": response_text or "...", "state": updated_state})


@app.get("/api/journal")
async def api_journal(limit: int = Query(10, ge=1, le=50), offset: int = Query(0, ge=0)):
    return JSONResponse(read_journal(limit=limit, offset=offset))


# ── WebSocket ────────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    connected_clients.add(ws)
    try:
        # Send current state immediately on connect
        state, found = read_state()
        if found:
            state["gateway_connected"] = gateway.is_connected
            await ws.send_json({"type": "state.update", "data": state})
        await ws.send_json({"type": "connection.status", "status": "connected" if gateway.is_connected else "disconnected"})
        # Keep alive — accept any frame type until disconnect
        while True:
            msg = await ws.receive()
            if msg.get("type") == "websocket.disconnect":
                break
    except WebSocketDisconnect:
        pass
    except Exception:
        log.debug("WebSocket closed unexpectedly")
    finally:
        connected_clients.discard(ws)


# ── Background: state file watcher ──────────────────────────────────────────

async def _watch_state_file():
    """Poll state.json mtime every 500ms, broadcast on change. Also monitors gateway health."""
    last_mtime: float = 0
    last_gateway_status: bool = False
    reconnect_delay: float = 5.0
    while True:
        try:
            # Check gateway health
            gw_alive = await gateway.check_health()
            if last_gateway_status and not gw_alive:
                # Gateway just crashed — broadcast disconnection
                log.warning("Gateway process died — broadcasting disconnect")
                status_msg = {"type": "connection.status", "status": "disconnected"}
                for ws in list(connected_clients):
                    try:
                        await ws.send_json(status_msg)
                    except Exception:
                        connected_clients.discard(ws)
                # Attempt reconnect after delay
                await asyncio.sleep(reconnect_delay)
                if await gateway.reconnect():
                    log.info("Gateway reconnected successfully")
                    status_msg = {"type": "connection.status", "status": "connected"}
                    for ws in list(connected_clients):
                        try:
                            await ws.send_json(status_msg)
                        except Exception:
                            connected_clients.discard(ws)
            last_gateway_status = gateway.is_connected

            # Watch state file
            mtime = STATE_FILE.stat().st_mtime
            if mtime != last_mtime:
                last_mtime = mtime
                state, found = read_state()
                if found:
                    state["gateway_connected"] = gateway.is_connected
                    msg = {"type": "state.update", "data": state}
                    for ws in list(connected_clients):
                        try:
                            await ws.send_json(msg)
                        except Exception:
                            connected_clients.discard(ws)
        except FileNotFoundError:
            pass
        except Exception:
            log.exception("State watcher error")
        await asyncio.sleep(0.5)


# ── Static files (Vite build) ───────────────────────────────────────────────

if _FRONTEND_DIST.is_dir():
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve built frontend; fall back to index.html for SPA routing."""
        file_path = _FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        index = _FRONTEND_DIST / "index.html"
        if index.is_file():
            return FileResponse(index)
        return JSONResponse({"error": "not_found"}, status_code=404)
