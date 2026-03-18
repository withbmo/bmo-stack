import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

export interface CommandSpec {
  command: string;
  args: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export interface TemplateSmokeCheck {
  url: string;
  timeoutMs?: number;
  path?: string;
}

export interface TemplateFileAssertion {
  path: string;
  includes?: string[];
  maxLines?: number;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  category: 'web' | 'api';
  stack: string;
  packageManager: 'pnpm' | 'npm' | 'uv';
  initCommands(targetDir: string): CommandSpec[];
  finalize(targetDir: string): Promise<void>;
  installCommand: CommandSpec | null;
  qualityCommands: CommandSpec[];
  buildCommand: CommandSpec | null;
  devCommand: CommandSpec;
  smokeCheck: TemplateSmokeCheck;
  requiredPaths: string[];
  requiredScripts?: string[];
  fileAssertions: TemplateFileAssertion[];
  readmeInitCommand: string;
}

export function repoRoot(): string {
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
}

export function templatesRoot(): string {
  return path.join(repoRoot(), 'templates');
}

export function templateDir(templateId: string): string {
  return path.join(templatesRoot(), templateId);
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function resetDir(dirPath: string): Promise<void> {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
}

export async function removeIfExists(targetPath: string): Promise<void> {
  await fs.rm(targetPath, { recursive: true, force: true });
}

export async function writeTextFile(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
}

export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export async function patchTextFile(
  filePath: string,
  transform: (content: string) => string,
): Promise<void> {
  const current = await readTextFile(filePath);
  await writeTextFile(filePath, transform(current));
}

export async function runCommand(spec: CommandSpec, label?: string): Promise<void> {
  await ensureDir(spec.cwd ?? process.cwd());

  await new Promise<void>((resolve, reject) => {
    const child = spawn(spec.command, spec.args, {
      cwd: spec.cwd,
      env: { ...process.env, ...spec.env },
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label ?? spec.command} exited with code ${code ?? 'unknown'}`));
    });
  });
}

export async function tryRunCommand(spec: CommandSpec, label?: string): Promise<boolean> {
  try {
    await runCommand(spec, label);
    return true;
  } catch {
    return false;
  }
}

export async function createTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function waitForHttp(url: string, timeoutMs = 60_000): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) {
        return;
      }
      lastError = new Error(`Unexpected status ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    }

    await delay(1_000);
  }

  throw new Error(
    `Timed out waiting for ${url}${lastError instanceof Error ? `: ${lastError.message}` : ''}`,
  );
}

export async function runDevSmokeCheck(
  command: CommandSpec,
  smokeCheck: TemplateSmokeCheck,
): Promise<void> {
  const child = spawn(command.command, command.args, {
    cwd: command.cwd,
    env: { ...process.env, ...command.env },
    stdio: 'inherit',
    shell: false,
    detached: true,
  });

  try {
    await waitForHttp(smokeCheck.url, smokeCheck.timeoutMs);
  } finally {
    if (child.pid) {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    } else {
      child.kill('SIGTERM');
    }

    await new Promise<void>((resolve) => {
      child.on('exit', () => resolve());
      setTimeout(() => {
        if (child.pid) {
          try {
            process.kill(-child.pid, 'SIGKILL');
          } catch {
            child.kill('SIGKILL');
          }
        } else if (!child.killed) {
          child.kill('SIGKILL');
        }
        resolve();
      }, 5_000);
    });
  }
}

export function commandToString(spec: CommandSpec): string {
  return [spec.command, ...spec.args].join(' ');
}

export function parseTemplateArgs(argv: string[]): { templateId?: string } {
  const templateIndex = argv.findIndex((arg) => arg === '--template');
  if (templateIndex >= 0) {
    return { templateId: argv[templateIndex + 1] };
  }

  const positional = argv.find((arg) => !arg.startsWith('--'));
  return positional ? { templateId: positional } : {};
}
