#!/usr/bin/env bash
# Sync built @rayt-me/plan-pricing into .local-packages so `file:` installs include full dist/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/../rayt-me-shared"
DEST="$ROOT/.local-packages/rayt-me-shared"

if [[ ! -d "$SRC" ]]; then
  echo "sync-shared: sibling rayt-me-shared not found at $SRC — keeping vendored .local-packages as-is"
  if [[ ! -f "$DEST/dist/plan-pricing.js" ]]; then
    echo "sync-shared: ERROR missing $DEST/dist/plan-pricing.js" >&2
    exit 1
  fi
  exit 0
fi

echo "sync-shared: building $SRC"
(
  cd "$SRC"
  pnpm install --frozen-lockfile >/dev/null 2>&1 || pnpm install >/dev/null
  pnpm exec tsc -p tsconfig.json
)

echo "sync-shared: copying into $DEST"
mkdir -p "$DEST"
rsync -a --delete \
  --exclude node_modules \
  --exclude .git \
  --exclude pnpm-lock.yaml \
  "$SRC"/ "$DEST"/

# Ensure package metadata includes dist for pnpm file: installs
python3 - <<PY
import json
from pathlib import Path
dest = Path("$DEST")
pkg_path = dest / "package.json"
pkg = json.loads(pkg_path.read_text())
pkg["name"] = "@rayt-me/plan-pricing"
pkg["files"] = ["dist", "src", "package.json", "README.md"]
pkg_path.write_text(json.dumps(pkg, indent=2) + "\n")
gi = dest / ".gitignore"
if gi.exists():
    lines = [l for l in gi.read_text().splitlines() if l.strip() not in {"dist", "/dist", "dist/"}]
    gi.write_text("\n".join(lines) + ("\n" if lines else ""))
print("sync-shared: package files=", ",".join(pkg["files"]))
PY

test -f "$DEST/dist/plan-pricing.js"
test -f "$DEST/dist/index.js"
echo "sync-shared: OK ($(ls "$DEST/dist" | wc -l | tr -d ' ') dist files)"
