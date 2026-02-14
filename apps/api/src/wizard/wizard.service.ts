import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import type { Prisma } from '@pytholit/db';
import type {
  BlueprintLock,
  WizardInput,
  WizardManifest,
  WizardSchema,
} from './wizard.types';

interface ValidationResult {
  inputs: WizardInput;
  errors: string[];
}

interface RenderResult {
  manifest: WizardManifest;
  lock: BlueprintLock;
}

function templateInterpolate(raw: string, inputs: WizardInput): string {
  // Minimal {{key}} interpolation for the current blueprint set.
  // (We intentionally avoid AWS + avoid bringing a templating dependency.)
  return raw.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    const value = inputs[key];
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  });
}

function matchesWhen(when: Record<string, unknown>, inputs: WizardInput): boolean {
  return Object.entries(when).every(([key, expected]) => {
    const actual = inputs[key];
    if (Array.isArray(actual)) return actual.includes(expected as never);
    return actual === expected;
  });
}

function validateAndApplyDefaults(
  schema: WizardSchema,
  rawInputs: WizardInput
): ValidationResult {
  const errors: string[] = [];
  const inputs: WizardInput = { ...rawInputs };

  for (const step of schema.steps) {
    for (const field of step.fields) {
      const value = inputs[field.id];
      const hasValue = value !== undefined && value !== null && value !== '';

      if (!hasValue && field.default !== undefined) {
        inputs[field.id] = field.default;
      }

      const finalValue = inputs[field.id];
      const finalHasValue =
        finalValue !== undefined && finalValue !== null && finalValue !== '';

      if (field.required && !finalHasValue) {
        errors.push(`Missing required field: ${field.id}`);
        continue;
      }

      if (!finalHasValue) continue;

      switch (field.type) {
        case 'string':
          if (typeof finalValue !== 'string') {
            errors.push(`Field ${field.id} must be a string`);
          }
          break;
        case 'number':
          if (typeof finalValue !== 'number') {
            errors.push(`Field ${field.id} must be a number`);
          }
          break;
        case 'boolean':
          if (typeof finalValue !== 'boolean') {
            errors.push(`Field ${field.id} must be a boolean`);
          }
          break;
        case 'select':
          if (typeof finalValue !== 'string') {
            errors.push(`Field ${field.id} must be a string`);
            break;
          }
          if (field.options && !field.options.some((o) => o.value === finalValue)) {
            errors.push(`Field ${field.id} has invalid option`);
          }
          break;
        case 'multi':
          if (!Array.isArray(finalValue)) {
            errors.push(`Field ${field.id} must be an array`);
            break;
          }
          if (field.options) {
            const allowed = new Set(field.options.map((o) => o.value));
            for (const v of finalValue) {
              if (!allowed.has(String(v))) {
                errors.push(`Field ${field.id} has invalid option: ${v}`);
              }
            }
          }
          break;
        default:
          break;
      }
    }
  }

  return { inputs, errors };
}

@Injectable()
export class WizardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private getDefaultVersion(): string {
    return this.configService.get<string>('WIZARD_DEFAULT_VERSION') || '2026.02.08';
  }

  private resolveVersion(version: string): string {
    return version === 'latest' ? this.getDefaultVersion() : version;
  }

  private async getBlueprintRootDir(): Promise<string> {
    // We support both dev (src) and prod (dist) layouts.
    const candidates = [
      // Monorepo root cwd (e.g. when started via turbo from repo root)
      path.join(process.cwd(), 'apps', 'api', 'dist', 'wizard', 'blueprints'),
      path.join(process.cwd(), 'apps', 'api', 'src', 'wizard', 'blueprints'),

      // apps/api cwd
      path.join(process.cwd(), 'dist', 'wizard', 'blueprints'),
      path.join(process.cwd(), 'src', 'wizard', 'blueprints'),

      // dist-relative (compiled file location)
      path.join(__dirname, 'blueprints'),
    ];

    for (const dir of candidates) {
      try {
        await fs.access(dir);
        return dir;
      } catch {
        // continue
      }
    }

    throw new NotFoundException(
      'Wizard blueprints are not available on this server'
    );
  }

  private async readBlueprintFile(
    version: string,
    relativePath: string
  ): Promise<string> {
    // Prevent path traversal: disallow absolute paths and "..".
    if (path.isAbsolute(relativePath) || relativePath.includes('..')) {
      throw new BadRequestException('Invalid blueprint path');
    }

    const root = await this.getBlueprintRootDir();
    const fullPath = path.join(root, version, relativePath);

    try {
      return await fs.readFile(fullPath, 'utf8');
    } catch {
      throw new NotFoundException(`Blueprint file not found: ${relativePath}`);
    }
  }

  async getSchema(requestedVersion: string): Promise<WizardSchema> {
    const version = this.resolveVersion(requestedVersion);
    const raw = await this.readBlueprintFile(version, 'blueprint.schema.json');
    try {
      return JSON.parse(raw) as WizardSchema;
    } catch {
      throw new BadRequestException('Invalid wizard schema JSON');
    }
  }

  private async renderWizard(
    schema: WizardSchema,
    version: string,
    inputs: WizardInput
  ): Promise<RenderResult> {
    const resolvedParts: Record<string, string[]> = {};
    const files: { path: string; content: string }[] = [];

    for (const [filePath, rule] of Object.entries(schema.rules.files)) {
      const parts: string[] = [];
      if (rule.base) parts.push(rule.base);
      for (const variant of rule.variants ?? []) {
        if (matchesWhen(variant.when, inputs)) parts.push(variant.use);
      }
      for (const addon of rule.addons ?? []) {
        if (matchesWhen(addon.when, inputs)) parts.push(addon.use);
      }

      resolvedParts[filePath] = parts;

      const renderedPieces: string[] = [];
      for (const part of parts) {
        const rawPart = await this.readBlueprintFile(version, part);
        renderedPieces.push(templateInterpolate(rawPart, inputs));
      }

      files.push({ path: filePath, content: renderedPieces.join('\n') });
    }

    const id = crypto.randomUUID();
    const generatedAt = new Date().toISOString();

    const manifest: WizardManifest = {
      id,
      version,
      projectName: typeof inputs.name === 'string' ? inputs.name : undefined,
      generatedAt,
      files: files.map((f) => ({ path: f.path, content: f.content })),
    };

    const lock: BlueprintLock = {
      id,
      version,
      schemaVersion: schema.version,
      inputs,
      resolvedParts,
      files: files.map((f) => ({
        path: f.path,
        sha256: crypto.createHash('sha256').update(f.content).digest('hex'),
      })),
      generatedAt,
    };

    return { manifest, lock };
  }

  async generate(
    userId: string,
    requestedVersion: string,
    projectId: string,
    rawInputs: WizardInput
  ): Promise<{ manifestId: string; id: string }> {
    const project = await this.prisma.client.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== userId)
      throw new ForbiddenException('Access denied to this project');

    const schema = await this.getSchema(requestedVersion);
    const { inputs, errors } = validateAndApplyDefaults(schema, rawInputs);
    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }

    const version = this.resolveVersion(requestedVersion);
    const { manifest, lock } = await this.renderWizard(schema, version, inputs);

    await this.prisma.client.wizardBuild.create({
      data: {
        id: manifest.id,
        ownerId: userId,
        projectId,
        version,
        inputs: inputs as unknown as Prisma.InputJsonValue,
        manifest: manifest as unknown as Prisma.InputJsonValue,
        lock: lock as unknown as Prisma.InputJsonValue,
      },
    });

    return { id: manifest.id, manifestId: manifest.id };
  }

  async getManifest(userId: string, manifestId: string): Promise<WizardManifest> {
    const build = await this.prisma.client.wizardBuild.findUnique({
      where: { id: manifestId },
      select: { ownerId: true, manifest: true },
    });

    if (!build) throw new NotFoundException('Manifest not found');
    if (build.ownerId !== userId) throw new ForbiddenException('Access denied');

    return build.manifest as unknown as WizardManifest;
  }
}

