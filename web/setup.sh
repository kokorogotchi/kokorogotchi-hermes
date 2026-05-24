#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== kokorogotchi web setup ==="

# Backend
echo ""
echo "→ Setting up backend..."
cd "$SCRIPT_DIR/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -q -r requirements.txt
echo "  ✓ Backend ready"

# Frontend
echo ""
echo "→ Setting up frontend..."
cd "$SCRIPT_DIR/frontend"
npm install --silent
npm run build
echo "  ✓ Frontend ready"

echo ""
echo "=== Setup complete. Run ./start.sh to launch. ==="
