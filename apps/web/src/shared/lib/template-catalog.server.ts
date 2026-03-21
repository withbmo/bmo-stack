import 'server-only';

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Template } from '@/shared/types';

import { parseProjectSpec, validateProjectSpec } from '../../../../../packages/project-spec/dist/index.js';

function inferTags(spec: ReturnType<typeof validateProjectSpec>): string[] {
  const tags = new Set<string>();

  for (const runtimeModule of spec.runtime.modules) {
    const normalized = runtimeModule.toLowerCase();
    if (normalized.startsWith('nodejs')) tags.add('node');
    if (normalized.startsWith('python')) tags.add('python');
    if (normalized.startsWith('redis')) tags.add('redis');
    if (normalized.startsWith('postgres')) tags.add('postgres');
  }

  for (const artifact of spec.artifacts) {
    tags.add(artifact.kind);
  }

  for (const service of spec.services) {
    tags.add(service.kind);
  }

  return Array.from(tags);
}

function inferStars(specId: string): number {
  const curatedWeights: Record<string, number> = {
    'next-web': 1200,
    'vite-react-web': 900,
    'fastify-api': 850,
    'fastapi-api': 1100,
  };

  return curatedWeights[specId] ?? 500;
}

async function readTemplateDirectories(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export async function getTemplateCatalog(): Promise<Template[]> {
  const templatesRoot = path.resolve(process.cwd(), '..', '..', 'templates');
  const templateDirs = await readTemplateDirectories(templatesRoot);
  const templates: Template[] = [];

  for (const templateDir of templateDirs) {
    const manifestPath = path.join(templatesRoot, templateDir, 'pytholit.toml');

    try {
      const manifest = await readFile(manifestPath, 'utf8');
      const spec = validateProjectSpec(parseProjectSpec(manifest));

      templates.push({
        id: spec.project.id,
        title: spec.project.name,
        description: spec.project.description ?? `${spec.project.name} starter template`,
        framework: spec.project.name,
        tags: inferTags(spec),
        author: 'Pytholit',
        stars: inferStars(spec.project.id),
        isOfficial: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown template parsing error';
      console.warn(`[templates] Skipping "${templateDir}": ${message}`);
    }
  }

  return templates;
}
