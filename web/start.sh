#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Build frontend if dist/ doesn't exist
if [[ ! -d "$SCRIPT_DIR/frontend/dist" ]]; then
  echo "→ Building frontend..."
  cd "$SCRIPT_DIR/frontend"
  if [[ ! -d "node_modules" ]]; then
    npm install
  fi
  npm run build
  cd "$SCRIPT_DIR"
fi

# Activate backend venv (fall back to project-level .venv)
if [[ -f "$SCRIPT_DIR/backend/.venv/bin/activate" ]]; then
  source "$SCRIPT_DIR/backend/.venv/bin/activate"
elif [[ -f "$SCRIPT_DIR/../.venv/bin/activate" ]]; then
  source "$SCRIPT_DIR/../.venv/bin/activate"
fi

echo "→ Starting Kokorogotchi on http://localhost:8000"
exec uvicorn backend.server:app --host 0.0.0.0 --port 8000 --ws-ping-interval 0 --app-dir "$SCRIPT_DIR"
