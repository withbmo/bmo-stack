#!/usr/bin/env bash
set -euo pipefail

: "${GODADDY_API_KEY:?GODADDY_API_KEY is required}"
: "${GODADDY_API_SECRET:?GODADDY_API_SECRET is required}"

api_base="${GODADDY_API_BASE:-https://api.godaddy.com}"
ttl="${GODADDY_NS_TTL:-600}"

delegation_json="$(terraform output -json delegation_record_for_godaddy 2>/dev/null || true)"
zone_name="$(terraform output -raw delegated_zone_name 2>/dev/null || true)"

if [[ -z "${delegation_json}" || "${delegation_json}" == "null" || -z "${zone_name}" ]]; then
  echo "No delegated DNS output found; skipping GoDaddy NS sync."
  exit 0
fi

host_label="$(jq -r '.host // ""' <<<"${delegation_json}")"
if [[ -z "${host_label}" ]]; then
  echo "Delegation host label is empty; skipping."
  exit 0
fi

if [[ "${zone_name}" == "${host_label}."* ]]; then
  parent_domain="${zone_name#${host_label}.}"
else
  echo "Could not derive parent domain from zone=${zone_name} host=${host_label}"
  exit 1
fi

payload="$(jq -c --argjson ttl "${ttl}" '[.values[] | {data: ., ttl: $ttl}]' <<<"${delegation_json}")"

echo "Syncing GoDaddy NS record: ${host_label}.${parent_domain}"
curl -fsS -X PUT \
  -H "Authorization: sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}" \
  -H "Content-Type: application/json" \
  "${api_base}/v1/domains/${parent_domain}/records/NS/${host_label}" \
  -d "${payload}" >/dev/null

echo "GoDaddy NS delegation synced successfully."
