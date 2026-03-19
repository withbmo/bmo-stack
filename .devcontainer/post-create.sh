#!/usr/bin/env bash
set -euo pipefail

cd /workspaces/pytholit-v2

copy_env_if_missing() {
  local source_file="$1"
  local target_file="$2"

  if [[ -f "$source_file" && ! -f "$target_file" ]]; then
    cp "$source_file" "$target_file"
  fi
}

copy_env_if_missing "apps/api/.env.example" "apps/api/.env"
copy_env_if_missing "apps/web/.env.example" "apps/web/.env.local"
copy_env_if_missing "apps/terminal-gateway/.env.example" "apps/terminal-gateway/.env"

CI=1 pnpm install --frozen-lockfile --config.confirmModulesPurge=false
pnpm db:generate

echo "Devcontainer setup complete."
