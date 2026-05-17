#!/usr/bin/env bash

set -euo pipefail

USER="iwbfnzmznr"
HOST="66.29.148.128"
APP_ROOT="/home/iwbfnzmznr/nightfall"
SSH_PORT="21098"

echo "==> Deploying Nightfall Terrace to ${USER}@${HOST}:${APP_ROOT}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/web"

echo "==> Installing dependencies (npm ci)"
npm ci

echo "==> Building production bundle"
NODE_ENV=production npm run build

echo "==> Creating production-build.tar.gz"
COPYFILE_DISABLE=1 tar czf production-build.tar.gz \
  .next \
  app.js \
  package.json \
  package-lock.json \
  public \
  .env.local \
  next.config.* 2>/dev/null || true

echo "==> Uploading archive to server"
scp -P "${SSH_PORT}" production-build.tar.gz "${USER}@${HOST}:${APP_ROOT}/"

echo "==> Running remote deploy commands"
ssh -p "${SSH_PORT}" "${USER}@${HOST}" bash -lc "
  set -euo pipefail
  cd '${APP_ROOT}'
  echo ' -> Unpacking production-build.tar.gz'
  tar xzf production-build.tar.gz
  echo ' -> Removing real node_modules (CloudLinux uses venv symlink)'
  rm -rf node_modules
  echo ' -> Done. In the hosting panel: run Install dependencies (if needed), then Restart app.'
"

echo "==> Deployment complete."
