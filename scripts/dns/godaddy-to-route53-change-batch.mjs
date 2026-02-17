#!/usr/bin/env node
/**
 * Convert GoDaddy DNS records JSON -> Route53 ChangeBatch JSON.
 *
 * Usage:
 *   node scripts/dns/godaddy-to-route53-change-batch.mjs <domain> <godaddy-records.json> [out.json]
 *
 * Optional env vars:
 *   - EXCLUDE_NAMES="dev,api.dev,terminal.dev,*.dev" (record names to skip; supports '*' wildcard)
 *
 * Notes:
 * - Skips zone apex NS/SOA (Route53 manages those).
 * - Groups multi-value record sets by (name,type) to avoid overwriting values.
 * - Best-effort conversion; review output before applying.
 */

import fs from 'node:fs';
import path from 'node:path';

function die(message) {
  console.error(message);
  process.exit(2);
}

const domain = process.argv[2];
const inputPath = process.argv[3];
const outputPath = process.argv[4] ?? '';

if (!domain || !inputPath) {
  die(
    'Usage: node scripts/dns/godaddy-to-route53-change-batch.mjs <domain> <godaddy-records.json> [out.json]'
  );
}

const raw = fs.readFileSync(inputPath, 'utf8');
/** @type {any[]} */
const records = JSON.parse(raw);
if (!Array.isArray(records)) die('Expected GoDaddy records JSON to be an array.');

const excludeNamesRaw = (process.env.EXCLUDE_NAMES ?? '').trim();
const excludeNamePatterns = excludeNamesRaw
  ? excludeNamesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

function matchWildcard(pattern, value) {
  if (pattern === value) return true;
  if (!pattern.includes('*')) return false;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*');
  const re = new RegExp(`^${escaped}$`);
  return re.test(value);
}

function ensureTrailingDot(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed === '') return trimmed;
  if (trimmed.endsWith('.')) return trimmed;
  return `${trimmed}.`;
}

function isIp(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(v)) return true;
  if (/^[0-9a-fA-F:]+$/.test(v) && v.includes(':')) return true;
  return false;
}

function normalizeName(recordName) {
  const n = (recordName ?? '').toString().trim();
  if (n === '' || n === '@') return `${domain}.`;
  if (n.endsWith('.')) return n;
  return `${n}.${domain}.`;
}

function quoteTxt(value) {
  const v = (value ?? '').toString();
  const trimmed = v.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed;
  const escaped = trimmed.replaceAll('"', '\\"');
  return `"${escaped}"`;
}

function recordValueForRoute53(rec) {
  const type = (rec.type ?? '').toString().toUpperCase();
  if (type === 'SRV') {
    const priority = Number(rec.priority ?? 0);
    const weight = Number(rec.weight ?? 0);
    const port = Number(rec.port ?? 0);
    const target = rec.data ? ensureTrailingDot(rec.data) : '';
    return `${priority} ${weight} ${port} ${target}`;
  }

  if (type === 'MX') {
    const priority = Number(rec.priority ?? 0);
    const target = rec.data ? ensureTrailingDot(rec.data) : '';
    return `${priority} ${target}`;
  }

  if (type === 'TXT') return quoteTxt(rec.data);

  if (type === 'CNAME' || type === 'NS') {
    if (rec.data && !isIp(rec.data)) return ensureTrailingDot(rec.data);
  }

  return (rec.data ?? '').toString();
}

function shouldSkip(rec) {
  const type = (rec.type ?? '').toString().toUpperCase();
  const name = (rec.name ?? '').toString();
  if (type === 'SOA') return true;
  if (type === 'NS' && (name === '@' || name.trim() === '')) return true;
  return false;
}

/** @type {Map<string, {Name:string, Type:string, TTL:number, Values:Set<string>}>} */
const recordSets = new Map();
/** @type {string[]} */
const warnings = [];

for (const rec of records) {
  const type = (rec.type ?? '').toString().toUpperCase();
  if (!type) continue;
  if (shouldSkip(rec)) continue;

  const originalName = (rec.name ?? '').toString().trim();
  if (excludeNamePatterns.some((p) => matchWildcard(p, originalName))) continue;

  const rrName = normalizeName(rec.name);
  const ttl = Number(rec.ttl ?? 600);
  const value = recordValueForRoute53(rec);

  if (type === 'CNAME' && rrName === `${domain}.`) {
    warnings.push(`Skip invalid apex CNAME for ${domain}`);
    continue;
  }

  if (!value || value.trim() === '') {
    warnings.push(`Skip empty record: ${type} ${rrName}`);
    continue;
  }

  const key = `${rrName}|${type}`;
  const existing = recordSets.get(key);
  if (!existing) {
    recordSets.set(key, { Name: rrName, Type: type, TTL: ttl, Values: new Set([value]) });
  } else {
    if (existing.TTL !== ttl) {
      warnings.push(`TTL mismatch for ${type} ${rrName}; keeping first TTL=${existing.TTL}, saw ${ttl}`);
    }
    existing.Values.add(value);
  }
}

/** @type {Array<{Action:'UPSERT', ResourceRecordSet:any}>} */
const changes = Array.from(recordSets.values()).map((rs) => ({
  Action: 'UPSERT',
  ResourceRecordSet: {
    Name: rs.Name,
    Type: rs.Type,
    TTL: rs.TTL,
    ResourceRecords: Array.from(rs.Values).map((Value) => ({ Value })),
  },
}));

const out = {
  Comment: `Imported from GoDaddy records for ${domain}`,
  Changes: changes,
  Warnings: warnings,
};

const json = JSON.stringify(out, null, 2);
if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, json);
  console.log(`Wrote ${outputPath}`);
} else {
  process.stdout.write(json);
}

if (warnings.length > 0) {
  console.error(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.error(`- ${w}`);
}
