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

import { readTrimmedStringOrDefault } from '../config/config-readers';
import {
  WIZARD_DEFAULT_TEMPLATE_ID_DEFAULT,
  WIZARD_DEFAULT_VERSION_DEFAULT,
  WIZARD_LEGACY_TEMPLATE_ID_DEFAULT,
} from '../config/defaults';
import { PrismaService } from '../database/prisma.service';
import type {
  BlueprintLock,
  WizardInput,
  WizardManifest,
  WizardSchema,
  WizardTemplateSummary,
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
  private readonly manifestCache = new Map<
    string,
    { ownerId: string; manifest: WizardManifest; createdAtMs: number }
  >();
  private readonly manifestCacheTtlMs = 60 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private getDefaultVersion(): string {
    return readTrimmedStringOrDefault(
      this.configService,
      'WIZARD_DEFAULT_VERSION',
      WIZARD_DEFAULT_VERSION_DEFAULT
    );
  }

  private getDefaultTemplateIdSync(): string {
    return readTrimmedStringOrDefault(
      this.configService,
      'WIZARD_DEFAULT_TEMPLATE_ID',
      WIZARD_DEFAULT_TEMPLATE_ID_DEFAULT
    );
  }

  private getLegacyTemplateId(): string {
    return readTrimmedStringOrDefault(
      this.configService,
      'WIZARD_LEGACY_TEMPLATE_ID',
      WIZARD_LEGACY_TEMPLATE_ID_DEFAULT
    );
  }

  private sortVersionsDesc(versions: string[]): string[] {
    return [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }

  private async resolveVersion(templateId: string, version: string): Promise<string> {
    if (version !== 'latest') return version;

    const catalog = await this.listTemplates();
    const template = catalog.find((t) => t.templateId === templateId);

    if (!template || template.versions.length === 0) {
      return this.getDefaultVersion();
    }

    return template.latestVersion;
  }

  private async getBlueprintRootDir(): Promise<string> {
    const candidates = [
      path.join(process.cwd(), 'apps', 'api', 'dist', 'wizard', 'blueprints'),
      path.join(process.cwd(), 'apps', 'api', 'src', 'wizard', 'blueprints'),
      path.join(process.cwd(), 'dist', 'wizard', 'blueprints'),
      path.join(process.cwd(), 'src', 'wizard', 'blueprints'),
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

  private async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async readBlueprintFile(
    templateId: string,
    version: string,
    relativePath: string
  ): Promise<string> {
    if (path.isAbsolute(relativePath) || relativePath.includes('..')) {
      throw new BadRequestException('Invalid blueprint path');
    }

    const root = await this.getBlueprintRootDir();
    const candidates = [
      path.join(root, templateId, version, relativePath),
    ];

    if (templateId === this.getLegacyTemplateId()) {
      candidates.push(path.join(root, version, relativePath));
    }

    for (const fullPath of candidates) {
      if (await this.exists(fullPath)) {
        return fs.readFile(fullPath, 'utf8');
      }
    }

    throw new NotFoundException(`Blueprint file not found: ${relativePath}`);
  }

  private async loadSchema(templateId: string, requestedVersion: string): Promise<WizardSchema> {
    const version = await this.resolveVersion(templateId, requestedVersion);
    const raw = await this.readBlueprintFile(templateId, version, 'blueprint.schema.json');
    try {
      return JSON.parse(raw) as WizardSchema;
    } catch {
      throw new BadRequestException('Invalid wizard schema JSON');
    }
  }

  async listTemplates(): Promise<WizardTemplateSummary[]> {
    const root = await this.getBlueprintRootDir();
    const entries = await fs.readdir(root, { withFileTypes: true });
    const templateVersions = new Map<string, Set<string>>();

    const ensureTemplate = (templateId: string) => {
      if (!templateVersions.has(templateId)) {
        templateVersions.set(templateId, new Set<string>());
      }
      return templateVersions.get(templateId)!;
    };

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const legacySchemaPath = path.join(root, entry.name, 'blueprint.schema.json');
      if (await this.exists(legacySchemaPath)) {
        ensureTemplate(this.getLegacyTemplateId()).add(entry.name);
        continue;
      }

      const templateDir = path.join(root, entry.name);
      const versionEntries = await fs.readdir(templateDir, { withFileTypes: true });
      for (const versionEntry of versionEntries) {
        if (!versionEntry.isDirectory()) continue;
        const schemaPath = path.join(templateDir, versionEntry.name, 'blueprint.schema.json');
        if (await this.exists(schemaPath)) {
          ensureTemplate(entry.name).add(versionEntry.name);
        }
      }
    }

    const templates: WizardTemplateSummary[] = [];

    for (const [templateId, versionsSet] of templateVersions.entries()) {
      const versions = this.sortVersionsDesc([...versionsSet]);
      if (versions.length === 0) continue;

      const latestVersion = versions[0]!;
      let title = templateId;
      try {
        const schema = await this.loadSchema(templateId, latestVersion);
        title = schema.title;
      } catch {
        // Keep templateId as fallback title.
      }

      templates.push({ templateId, title, versions, latestVersion });
    }

    return templates.sort((a, b) => a.templateId.localeCompare(b.templateId));
  }

  async getSchema(requestedVersion: string): Promise<WizardSchema> {
    const templateId = this.getDefaultTemplateIdSync();
    return this.loadSchema(templateId, requestedVersion);
  }

  async getSchemaForTemplate(templateId: string, requestedVersion: string): Promise<WizardSchema> {
    return this.loadSchema(templateId, requestedVersion);
  }

  private async renderWizard(
    schema: WizardSchema,
    templateId: string,
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
        const rawPart = await this.readBlueprintFile(templateId, version, part);
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
    const templateId = this.getDefaultTemplateIdSync();
    return this.generateForTemplate(userId, templateId, requestedVersion, projectId, rawInputs);
  }

  async generateForTemplate(
    userId: string,
    templateId: string,
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

    const schema = await this.loadSchema(templateId, requestedVersion);
    const { inputs, errors } = validateAndApplyDefaults(schema, rawInputs);
    if (errors.length > 0) {
      throw new BadRequestException({ errors });
    }

    const version = await this.resolveVersion(templateId, requestedVersion);
    const { manifest, lock } = await this.renderWizard(schema, templateId, version, inputs);
    void lock;
    this.storeManifest(userId, manifest);

    void projectId;
    void version;
    void inputs;

    return { id: manifest.id, manifestId: manifest.id };
  }

  async getManifest(userId: string, manifestId: string): Promise<WizardManifest> {
    const entry = this.getCachedManifest(manifestId);
    if (!entry) throw new NotFoundException('Manifest not found');
    if (entry.ownerId !== userId) throw new ForbiddenException('Access denied');
    return entry.manifest;
  }

  private storeManifest(ownerId: string, manifest: WizardManifest): void {
    this.cleanupManifestCache();
    this.manifestCache.set(manifest.id, {
      ownerId,
      manifest,
      createdAtMs: Date.now(),
    });
  }

  private getCachedManifest(manifestId: string): { ownerId: string; manifest: WizardManifest } | null {
    this.cleanupManifestCache();
    const entry = this.manifestCache.get(manifestId);
    if (!entry) return null;
    return { ownerId: entry.ownerId, manifest: entry.manifest };
  }

  private cleanupManifestCache(): void {
    const now = Date.now();
    for (const [manifestId, entry] of this.manifestCache.entries()) {
      if (now - entry.createdAtMs > this.manifestCacheTtlMs) {
        this.manifestCache.delete(manifestId);
      }
    }
  }
}
