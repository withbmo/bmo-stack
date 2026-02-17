#!/usr/bin/env bash
set -euo pipefail

deploy_env=""
domain_name="pytholit.dev"
app_domain_prefix=""
app_domain_name=""

usage() {
  echo "Usage: $0 --deploy-env <dev|prod> [--domain <domain>] [--app-domain-prefix <prefix>] [--app-domain-name <fqdn>]" >&2
  exit 2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --deploy-env)
      deploy_env="$2"
      shift 2
      ;;
    --domain)
      domain_name="$2"
      shift 2
      ;;
    --app-domain-prefix)
      app_domain_prefix="$2"
      shift 2
      ;;
    --app-domain-name)
      app_domain_name="$2"
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

if [[ -z "$deploy_env" ]]; then
  usage
fi

if [[ -z "$app_domain_name" ]]; then
  if [[ -z "$app_domain_prefix" && "$deploy_env" == "dev" ]]; then
    app_domain_prefix="dev"
  fi

  if [[ -n "$app_domain_prefix" ]]; then
    app_domain_name="${app_domain_prefix}.${domain_name}"
  else
    app_domain_name="${domain_name}"
  fi
fi

web_url="https://${app_domain_name}"
api_url="https://api.${app_domain_name}"

echo "Smoke checking:"
echo "  web: $web_url"
echo "  api: $api_url"

curl_status() {
  local url="$1"
  curl -sS -o /dev/null -w '%{http_code}' "$url" || echo "000"
}

retry_until() {
  local name="$1"
  local url="$2"
  local want_regex="$3"
  local attempts=12
  local delay=10

  for ((i = 1; i <= attempts; i++)); do
    code="$(curl_status "$url")"
    if [[ "$code" =~ $want_regex ]]; then
      echo "[ok] $name ($url) => $code"
      return 0
    fi
    echo "[wait] $name ($url) => $code (attempt $i/$attempts)"
    sleep "$delay"
  done

  echo "[fail] $name ($url) did not match $want_regex" >&2
  curl -sS -D - -o /dev/null "$url" | sed -n '1,40p' >&2 || true
  return 1
}

retry_until "api health" "${api_url}/api/v1/health" '^200$'
retry_until "web root" "${web_url}/" '^(200|301|302)$'
retry_until "me unauth" "${api_url}/api/v1/users/me" '^401$'

echo "Smoke check passed."

