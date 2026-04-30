#!/bin/bash
set -uo pipefail
FAIL=0

cd "$(dirname "$0")/../.." || exit 1

echo ""
echo "========================================="
echo "  Claude Code Quality Gate — dattaremit-web"
echo "========================================="

echo ""
echo "=== [1/7] Prettier format check ==="
npx prettier --check . --ignore-path .gitignore 2>&1 || FAIL=1

echo ""
echo "=== [2/7] ESLint ==="
npm run lint 2>&1 || FAIL=1

echo ""
echo "=== [3/7] TypeScript type check ==="
npx tsc --noEmit 2>&1 || FAIL=1

echo ""
echo "=== [4/7] Unit tests ==="
npm test -- --passWithNoTests 2>&1 || FAIL=1

echo ""
echo "=== [5/7] Security audit (high + critical only) ==="
npm audit --audit-level=high 2>&1 || FAIL=1

echo ""
echo "=== [6/7] Dead code — knip (warnings only, never blocks) ==="
npx knip 2>&1 || true

echo ""
echo "=== [7/7] Build verification (warnings only) ==="
npm run build 2>&1 | tail -20 || true

echo ""
if [ $FAIL -ne 0 ]; then
  echo "QUALITY GATE FAILED — fix errors above before pushing." >&2
  exit 2
fi
echo "All checks have passed."
exit 0
