#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { readdirSync, rmSync, rmdirSync } from 'node:fs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || args.has('-n');

const DIRS_TO_REMOVE = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  '.pytest_cache',
  '.mypy_cache',
  '.ruff_cache',
  '.cache',
]);

const FILES_TO_REMOVE = new Set([
  '.knip-report.json',
  '.knip-unused-files.txt',
  '.web-typecheck.log',
  'next-env.d.ts',
]);

function removePath(targetPath) {
  if (dryRun) {
    console.log(`[dry-run] remove ${targetPath}`);
    return;
  }
  rmSync(targetPath, { recursive: true, force: true });
}

function walkAndRemove(rootDir) {
  const entries = readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '.git') continue;
      if (DIRS_TO_REMOVE.has(entry.name)) {
        removePath(entryPath);
        continue;
      }
      walkAndRemove(entryPath);
      continue;
    }

    if (FILES_TO_REMOVE.has(entry.name) || entry.name.endsWith('.tsbuildinfo')) {
      removePath(entryPath);
    }
  }
}

function pruneEmptyDirs(rootDir) {
  if (rootDir.endsWith(`${path.sep}.git`)) return false;

  let entries;
  try {
    entries = readdirSync(rootDir, { withFileTypes: true });
  } catch {
    return false;
  }

  let isEmpty = true;
  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git') {
        isEmpty = false;
        continue;
      }
      if (DIRS_TO_REMOVE.has(entry.name)) {
        isEmpty = false;
        continue;
      }
      const removed = pruneEmptyDirs(entryPath);
      if (!removed) isEmpty = false;
    } else {
      isEmpty = false;
    }
  }

  if (!isEmpty) return false;
  if (rootDir === process.cwd()) return false;

  if (dryRun) {
    console.log(`[dry-run] rmdir ${rootDir}`);
    return true;
  }

  try {
    rmdirSync(rootDir);
    return true;
  } catch {
    return false;
  }
}

walkAndRemove(process.cwd());
pruneEmptyDirs(process.cwd());
