import { parse as parseToml } from '@iarna/toml';
import { ZodError } from 'zod';

import { ProjectSpecError, type ProjectSpecIssue } from './errors';
import { rawProjectSpecSchema, type RawProjectSpec, type RawProjectSpecInput } from './schema';
import type { EnvironmentSpec, ProjectSpec } from './types';

function formatPath(path: Array<string | number>): string {
  if (path.length === 0) return '$';
  return path.reduce<string>((acc, part) => {
    if (typeof part === 'number') return `${acc}[${part}]`;
    return acc === '$' ? `$.${part}` : `${acc}.${part}`;
  }, '$');
}

function zodIssuesToProjectIssues(error: ZodError): ProjectSpecIssue[] {
  return error.issues.map((issue) => ({
    path: formatPath(issue.path.filter((part): part is string | number => typeof part !== 'symbol')),
    message: issue.message,
  }));
}

function normalizeEnvironmentSpecs(
  environments: RawProjectSpec['environments'],
): Record<string, EnvironmentSpec> {
  return Object.fromEntries(
    Object.entries(environments).map(([name, environment]) => [
      name,
      {
        domain: environment.domain,
        env: environment.env,
      },
    ]),
  );
}

function normalizeProjectSpec(input: RawProjectSpec): ProjectSpec {
  return {
    version: input.version,
    project: {
      id: input.project.id,
      name: input.project.name,
      description: input.project.description,
      metadata: input.project.metadata,
    },
    runtime: input.runtime,
    deployment: input.deployment,
    artifacts: input.artifacts.map((artifact) => ({
      ...artifact,
      env: artifact.env,
    })),
    services: input.services.map((service) => ({
      ...service,
      env: service.env,
      secrets: service.secrets,
    })),
    routes: input.routes,
    resources: input.resources.map((resource) => ({
      ...resource,
      config: resource.config,
    })),
    bindings: input.bindings,
    environments: normalizeEnvironmentSpecs(input.environments),
  };
}

export function parseProjectSpec(input: string | RawProjectSpecInput): ProjectSpec {
  let rawValue: unknown = input;

  if (typeof input === 'string') {
    try {
      rawValue = parseToml(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid TOML';
      throw new ProjectSpecError('Failed to parse project spec TOML', [
        { path: '$', message },
      ]);
    }
  }

  try {
    const parsed = rawProjectSpecSchema.parse(rawValue);
    return normalizeProjectSpec(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ProjectSpecError('Project spec validation failed', zodIssuesToProjectIssues(error));
    }
    throw error;
  }
}
