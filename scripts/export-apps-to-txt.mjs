#!/usr/bin/env node
/**
 * Exports all files under apps/web and apps/api to a single .txt file.
 * Respects .gitignore-style patterns (node_modules, dist, .next, .env, etc.).
 *
 * Usage: node scripts/export-apps-to-txt.mjs [output.txt]
 * Default output: apps-export.txt in project root
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const OUTPUT_DEFAULT = path.join(ROOT, 'apps-export.txt');

// Patterns that exclude a path (relative to root); match if any of these match
const IGNORE_PATTERNS = [
  /node_modules[/\\]/,
  /\.next[/\\]/,
  /\bout[/\\]/,
  /\bbuild[/\\]/,
  /\bdist[/\\]/,
  /\.turbo[/\\]/,
  /\.vercel[/\\]/,
  /\.git[/\\]/,
  /\.cursor[/\\]/,
  /\.vscode[/\\]/,
  /\.idea[/\\]/,
  /coverage[/\\]/,
  /\.env$/,
  /\.env\./,
  /\.DS_Store$/,
  /\.tsbuildinfo$/,
  /next-env\.d\.ts$/,
  /\.pem$/,
  /\.lcov$/,
  /\.swp$/,
  /\.swo$/,
  /~\s*$/,
];

function isIgnored(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  return IGNORE_PATTERNS.some(re => re.test(normalized));
}

function* walkDir(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(baseDir, full);
    if (isIgnored(rel)) continue;
    if (ent.isDirectory()) {
      yield* walkDir(full, baseDir);
    } else if (ent.isFile()) {
      yield { fullPath: full, relativePath: rel };
    }
  }
}

function getAllFiles(appDir) {
  const baseDir = path.join(ROOT, appDir);
  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    return [];
  }
  return [...walkDir(baseDir, ROOT)].map(({ relativePath }) => relativePath);
}

function isLikelyBinary(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const binary = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.webp',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.otf',
    '.pdf',
    '.zip',
    '.tar',
    '.gz',
    '.mp3',
    '.mp4',
    '.webm',
  ];
  return binary.includes(ext);
}

function readFileSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch {
    return null;
  }
}

function main() {
  const outPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : OUTPUT_DEFAULT;

  const webFiles = getAllFiles('apps/web').sort();
  const apiFiles = getAllFiles('apps/api').sort();
  const allRelative = [...webFiles, ...apiFiles].sort();

  const lines = [];
  for (const rel of allRelative) {
    const fullPath = path.join(ROOT, rel);
    if (isLikelyBinary(fullPath)) continue;
    const content = readFileSafe(fullPath);
    if (content === null) continue;

    lines.push(`${rel}:`);
    lines.push('```');
    lines.push(content);
    lines.push('```');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`Exported ${allRelative.length} files to ${outPath}`);
}

main();
