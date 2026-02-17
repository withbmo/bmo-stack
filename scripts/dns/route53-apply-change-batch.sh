#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "" || "${2:-}" == "" ]]; then
  echo "Usage: $0 <hosted_zone_id> <change-batch.json>" >&2
  exit 2
fi

zone_id="$1"
batch_file="$2"

aws route53 change-resource-record-sets \
  --hosted-zone-id "$zone_id" \
  --change-batch "file://$batch_file"

