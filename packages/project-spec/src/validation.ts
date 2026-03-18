import { ProjectSpecError, type ProjectSpecIssue } from './errors';
import type { ProjectSpec, ResourceSpec, RouteSpec, ServiceSpec } from './types';

function issue(path: string, message: string): ProjectSpecIssue {
  return { path, message };
}

function collectDuplicateIds(items: Array<{ id: string }>, basePath: string): ProjectSpecIssue[] {
  const counts = new Map<string, number>();
  const issues: ProjectSpecIssue[] = [];

  for (const item of items) {
    counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
  }

  for (const [id, count] of counts.entries()) {
    if (count > 1) {
      issues.push(issue(basePath, `Duplicate id "${id}"`));
    }
  }

  return issues;
}

function validateServiceShape(service: ServiceSpec, index: number): ProjectSpecIssue[] {
  const issues: ProjectSpecIssue[] = [];
  const basePath = `$.services[${index}]`;

  if (service.kind === 'static' && !service.static) {
    issues.push(issue(basePath, 'Static services must define [services.static]'));
  }

  if (service.kind !== 'static' && service.static) {
    issues.push(issue(`${basePath}.static`, 'Only static services may define [services.static]'));
  }

  if (service.kind === 'http' && !service.run?.port) {
    issues.push(issue(basePath, 'HTTP services must define [services.run].port'));
  }

  if (service.run?.port && !Number.isInteger(service.run.port)) {
    issues.push(issue(`${basePath}.run.port`, 'Service port must be an integer'));
  }

  return issues;
}

function validateRoute(route: RouteSpec, index: number, services: Set<string>): ProjectSpecIssue[] {
  const issues: ProjectSpecIssue[] = [];
  const basePath = `$.routes[${index}]`;

  if (!route.path.startsWith('/')) {
    issues.push(issue(`${basePath}.path`, 'Route path must start with "/"'));
  }

  if (!services.has(route.service)) {
    issues.push(issue(`${basePath}.service`, `Route references unknown service "${route.service}"`));
  }

  return issues;
}

function validateResource(resource: ResourceSpec, index: number): ProjectSpecIssue[] {
  const issues: ProjectSpecIssue[] = [];
  const basePath = `$.resources[${index}]`;

  if (resource.mode === 'managed' && resource.kind.length === 0) {
    issues.push(issue(basePath, 'Managed resources must define a kind'));
  }

  return issues;
}

export function validateProjectSpec(spec: ProjectSpec): ProjectSpec {
  const issues: ProjectSpecIssue[] = [];

  if (spec.version !== 1) {
    issues.push(issue('$.version', `Unsupported project spec version "${spec.version}"`));
  }

  if (spec.artifacts.length === 0) {
    issues.push(issue('$.artifacts', 'At least one artifact is required'));
  }

  if (spec.services.length === 0) {
    issues.push(issue('$.services', 'At least one service is required'));
  }

  issues.push(...collectDuplicateIds(spec.artifacts, '$.artifacts'));
  issues.push(...collectDuplicateIds(spec.services, '$.services'));
  issues.push(...collectDuplicateIds(spec.resources, '$.resources'));

  const artifactIds = new Set(spec.artifacts.map((artifact) => artifact.id));
  const serviceIds = new Set(spec.services.map((service) => service.id));
  const resourceIds = new Set(spec.resources.map((resource) => resource.id));

  for (const [index, artifact] of spec.artifacts.entries()) {
    const basePath = `$.artifacts[${index}]`;

    if (!artifact.build?.command && !artifact.dev?.command) {
      issues.push(issue(basePath, 'Artifact must define build.command, dev.command, or both'));
    }
  }

  for (const [index, service] of spec.services.entries()) {
    const basePath = `$.services[${index}]`;

    if (!artifactIds.has(service.artifact)) {
      issues.push(issue(`${basePath}.artifact`, `Unknown artifact "${service.artifact}"`));
    }

    issues.push(...validateServiceShape(service, index));
  }

  for (const [index, route] of spec.routes.entries()) {
    issues.push(...validateRoute(route, index, serviceIds));
  }

  for (const [index, resource] of spec.resources.entries()) {
    issues.push(...validateResource(resource, index));
  }

  for (const [index, binding] of spec.bindings.entries()) {
    const basePath = `$.bindings[${index}]`;

    if (!serviceIds.has(binding.service)) {
      issues.push(issue(`${basePath}.service`, `Unknown service "${binding.service}"`));
    }

    if (!resourceIds.has(binding.resource)) {
      issues.push(issue(`${basePath}.resource`, `Unknown resource "${binding.resource}"`));
    }
  }

  for (const [environmentName] of Object.entries(spec.environments)) {
    if (environmentName.trim().length === 0) {
      issues.push(issue('$.environments', 'Environment names must not be empty'));
    }
  }

  if (spec.deployment.defaultEnvironment && !(spec.deployment.defaultEnvironment in spec.environments)) {
    issues.push(
      issue(
        '$.deployment.defaultEnvironment',
        `Default environment "${spec.deployment.defaultEnvironment}" is not defined in [environments]`,
      ),
    );
  }

  if (issues.length > 0) {
    throw new ProjectSpecError('Project spec validation failed', issues);
  }

  return spec;
}
