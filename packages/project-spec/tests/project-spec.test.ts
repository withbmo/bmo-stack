import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createBuildPlan,
  createProjectPlans,
  parseProjectSpec,
  ProjectSpecError,
  validateProjectSpec,
} from '../src/index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.resolve(__dirname, '../examples');

async function readExample(name: string): Promise<string> {
  return fs.readFile(path.join(examplesDir, name), 'utf8');
}

test('parses and validates the minimal single app example', async () => {
  const spec = validateProjectSpec(parseProjectSpec(await readExample('single-app.toml')));
  const plans = createProjectPlans(spec);

  assert.equal(spec.project.id, 'hello-http');
  assert.equal(spec.artifacts.length, 1);
  assert.equal(spec.services.length, 1);
  assert.equal(plans.routePlan.routes.length, 1);
  assert.equal(plans.runtimePlan.services[0]?.secrets[0], 'DATABASE_URL');
});

test('build plan keeps artifacts and services distinct', async () => {
  const spec = validateProjectSpec(parseProjectSpec(await readExample('workspace-multi-artifact.toml')));
  const buildPlan = createBuildPlan(spec);

  assert.equal(buildPlan.artifacts.length, 3);
  assert.deepEqual(
    buildPlan.artifacts.map((artifact) => artifact.artifactId),
    ['landing', 'admin', 'api'],
  );
});

test('bindings are optional and only active when managed resources are enabled', async () => {
  const spec = validateProjectSpec(parseProjectSpec(await readExample('managed-postgres.toml')));
  const productionPlan = createProjectPlans(spec, 'production');
  const apiService = productionPlan.runtimePlan.services.find((service) => service.serviceId === 'api-http');

  assert.equal(apiService?.bindings.length, 1);
  assert.equal(apiService?.bindings[0]?.resourceId, 'main-db');
});

test('validation reports unknown artifact references clearly', () => {
  const brokenSpecToml = `
version = 1

[project]
id = "broken"
name = "Broken"

[runtime]
modules = ["nodejs-24"]

[deployment]
defaultEnvironment = "development"

[[artifacts]]
id = "web"
kind = "web"
path = "apps/web"

[artifacts.build]
command = "pnpm build"

[[services]]
id = "web-http"
artifact = "missing"
kind = "http"
public = true

[services.run]
command = "node server.js"
port = 3000

[environments.development]
domain = "localhost"
`;

  assert.throws(
    () => validateProjectSpec(parseProjectSpec(brokenSpecToml)),
    (error: unknown) =>
      error instanceof ProjectSpecError &&
      error.issues.some((item) => item.message.includes('Unknown artifact "missing"')),
  );
});
