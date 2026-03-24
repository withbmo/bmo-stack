#!/usr/bin/env node

const raw = process.versions.node;
const [majorStr, minorStr, patchStr] = raw.split('.');
const major = Number.parseInt(majorStr, 10);
const minor = Number.parseInt(minorStr, 10);
const patch = Number.parseInt(patchStr, 10);

const isValid20 = major === 20 && (minor > 19 || (minor === 19 && patch >= 0));
const isValid22 = major === 22 && (minor > 12 || (minor === 12 && patch >= 0));
const isValid24Plus = major >= 24;

if (isValid20 || isValid22 || isValid24Plus) {
  process.exit(0);
}

console.error(
  [
    `Unsupported Node.js version: ${raw}`,
    'Required: ^20.19.0 || ^22.12.0 || >=24.0.0',
    'Please upgrade Node.js and run pnpm install again.',
  ].join('\n'),
);
process.exit(1);
