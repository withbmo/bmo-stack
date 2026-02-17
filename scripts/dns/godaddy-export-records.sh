#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <domain> [output.json]" >&2
  exit 2
fi

domain="$1"
out="${2:-}"

: "${GODADDY_API_KEY:?Set GODADDY_API_KEY in your environment}"
: "${GODADDY_API_SECRET:?Set GODADDY_API_SECRET in your environment}"

auth="sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}"
base="${GODADDY_API_BASE:-https://api.godaddy.com}"
url="${base}/v1/domains/${domain}/records"

if [[ "$out" == "" ]]; then
  tmp="$(mktemp)"
  code="$(
    curl -sS -o "$tmp" -w "%{http_code}" \
      -H "Authorization: ${auth}" \
      -H "Accept: application/json" \
      "$url" || true
  )"
  if [[ "$code" != "200" ]]; then
    echo "GoDaddy API request failed: HTTP $code" >&2
    echo "URL: $url" >&2
    echo "Tip: if your key is an OTE (test) key, set GODADDY_API_BASE=https://api.ote-godaddy.com" >&2
    echo "Response body:" >&2
    sed -n '1,200p' "$tmp" >&2 || true
    rm -f "$tmp"
    exit 1
  fi
  cat "$tmp"
  rm -f "$tmp"
else
  tmp="$(mktemp)"
  code="$(
    curl -sS -o "$tmp" -w "%{http_code}" \
      -H "Authorization: ${auth}" \
      -H "Accept: application/json" \
      "$url" || true
  )"
  if [[ "$code" != "200" ]]; then
    echo "GoDaddy API request failed: HTTP $code" >&2
    echo "URL: $url" >&2
    echo "Tip: if your key is an OTE (test) key, set GODADDY_API_BASE=https://api.ote-godaddy.com" >&2
    echo "Response body:" >&2
    sed -n '1,200p' "$tmp" >&2 || true
    rm -f "$tmp"
    exit 1
  fi
  cat "$tmp" > "$out"
  rm -f "$tmp"
  echo "Wrote $out"
fi
