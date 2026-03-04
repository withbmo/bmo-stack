#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

OUT_DIR="${1:-./artifacts/billing-archive}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TARGET_DIR="${OUT_DIR}/${STAMP}"
mkdir -p "${TARGET_DIR}"

for table in user_payment_methods payments; do
  if psql "${DATABASE_URL}" -tAc "SELECT to_regclass('public.${table}') IS NOT NULL" | grep -q t; then
    pg_dump "${DATABASE_URL}" --data-only --table="public.${table}" --column-inserts > "${TARGET_DIR}/${table}.sql"
    shasum -a 256 "${TARGET_DIR}/${table}.sql" > "${TARGET_DIR}/${table}.sha256"
  fi
done

cat > "${TARGET_DIR}/README.txt" <<RUNBOOK
Legacy billing archive generated at: ${STAMP}
Source tables: public.user_payment_methods, public.payments
Checksum files: *.sha256
Storage recommendation: upload this folder to immutable object storage (WORM) and reference the object version ID in migration runbook.
RUNBOOK

echo "Archive created at ${TARGET_DIR}"
