# Kokorogotchi Web App

PWA web interface for Kokorogotchi — view Kokoro's state, perform care actions, read journal entries, and track evolution.

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Hermes agent installed at `~/.hermes/hermes-agent/`
- (Optional) Tailscale for phone access

## Setup

```bash
cd web
./setup.sh
```

Or manually:

```bash
# Backend
cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && cd ..

# Frontend
cd frontend && npm install && npm run build && cd ..
```

## Run

```bash
./start.sh
# → http://localhost:8000
```

### Development Mode

Terminal 1 (backend):
```bash
cd backend && source .venv/bin/activate && uvicorn server:app --port 8000 --reload
```

Terminal 2 (frontend):
```bash
cd frontend && npm run dev
# → http://localhost:5173 (proxies API to :8000)
```

## Phone Access (Tailscale)

1. Install Tailscale on Mac and phone
2. Run `./start.sh` on Mac
3. On phone: `http://<mac-tailscale-ip>:8000`
4. Tap "Add to Home Screen" for standalone PWA

## Troubleshooting

**Gateway not connecting**: Ensure `~/.hermes/hermes-agent/venv/bin/python3 -m tui_gateway.entry` runs without errors. The sidecar will operate in read-only fallback mode if the gateway is unavailable.

**Port 8000 in use**: Kill the existing process (`lsof -i :8000 | grep LISTEN`) or change the port in `start.sh`.

**Frontend not updating**: Delete `frontend/dist/` and re-run `./start.sh` or `cd frontend && npm run build`.

**Care buttons show "offline"**: The Hermes gateway subprocess isn't running or crashed. Check backend logs for connection errors.
