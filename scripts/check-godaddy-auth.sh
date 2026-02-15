#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <domain>"
  exit 1
fi

domain="$1"

if [[ -z "${GODADDY_API_KEY:-}" || -z "${GODADDY_API_SECRET:-}" ]]; then
  echo "GoDaddy API secrets are not set; skipping auth check."
  exit 0
fi

api_base="${GODADDY_API_BASE:-https://api.godaddy.com}"

tmp_body="$(mktemp)"
status_code="$(
  curl -sS -o "${tmp_body}" -w "%{http_code}" -X GET \
    -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
    -H "Accept: application/json" \
    "${api_base}/v1/domains/${domain}"
)"

if [[ "${status_code}" -lt 200 || "${status_code}" -ge 300 ]]; then
  echo "GoDaddy auth check failed (HTTP ${status_code})."
  echo "Endpoint: ${api_base}/v1/domains/${domain}"
  echo "Response body:"
  cat "${tmp_body}"
  rm -f "${tmp_body}"
  exit 1
fi

rm -f "${tmp_body}"
echo "GoDaddy auth check passed for domain ${domain}."
