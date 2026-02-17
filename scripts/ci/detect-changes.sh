#!/usr/bin/env bash
set -euo pipefail

: "${GIT_SHA:=${GITHUB_SHA:-}}"

if [[ -z "$GIT_SHA" ]]; then
  echo "GIT_SHA is required (or set GITHUB_SHA)." >&2
  exit 2
fi

# NOTE: `git diff-tree` can return an empty list for merge commits unless `-m` is used.
# `git show` defaults to the first parent diff, which is what we want for "what changed in this commit".
changed_files="$(git show --name-only --pretty='' "$GIT_SHA" 2>/dev/null || true)"

if [[ -z "$changed_files" ]]; then
  changed_files="$(git diff-tree -m --no-commit-id --name-only -r "$GIT_SHA" 2>/dev/null | sort -u || true)"
fi

is_docs_only=true
needs_build=false
needs_terraform=false

while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  case "$file" in
    docs/*|README.md|LICENSE*|**/*.md)
      ;;
    *)
      is_docs_only=false
      ;;
  esac

  if [[ "$file" == infra/* ]]; then
    needs_terraform=true
  fi

  case "$file" in
    apps/*|packages/*|docker/*|scripts/*|.github/workflows/*|pnpm-lock.yaml|package.json|pnpm-workspace.yaml|turbo.json|tsconfig.base.json)
      needs_build=true
      ;;
  esac
done <<<"$changed_files"

needs_deploy=true
if [[ "$is_docs_only" == "true" ]]; then
  needs_deploy=false
fi

echo "GIT_SHA=$GIT_SHA"
echo "needs_build=$needs_build"
echo "needs_terraform=$needs_terraform"
echo "needs_deploy=$needs_deploy"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "changed_files<<EOF"
    echo "$changed_files"
    echo "EOF"
    echo "is_docs_only=$is_docs_only"
    echo "needs_build=$needs_build"
    echo "needs_terraform=$needs_terraform"
    echo "needs_deploy=$needs_deploy"
  } >>"$GITHUB_OUTPUT"
fi
