import fs from 'node:fs/promises';
import path from 'node:path';

import {
  createBuildPlan,
  createRoutePlan,
  createRuntimePlan,
  parseProjectSpec,
  validateProjectSpec,
} from '../../packages/project-spec/src/index.ts';
import { getTemplateDefinitions, withTargetDir } from './registry.js';
import { commandToString, parseTemplateArgs, runCommand, runDevSmokeCheck, templateDir } from './shared.js';

async function assertPathExists(targetPath: string, message: string): Promise<void> {
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(message);
  }
}

async function assertFileIncludes(targetPath: string, pattern: string, message: string): Promise<void> {
  const content = await fs.readFile(targetPath, 'utf8');
  if (!content.includes(pattern)) {
    throw new Error(message);
  }
}

async function assertFileMaxLines(targetPath: string, maxLines: number, message: string): Promise<void> {
  const content = await fs.readFile(targetPath, 'utf8');
  const lines = content.split('\n').length;
  if (lines > maxLines) {
    throw new Error(message);
  }
}

async function validateTemplate(templateId?: string): Promise<void> {
  for (const definition of getTemplateDefinitions(templateId)) {
    const targetDir = templateDir(definition.id);
    const manifestPath = path.join(targetDir, 'pytholit.toml');

    console.log(`\n==> Validating ${definition.id}`);

    const manifest = await fs.readFile(manifestPath, 'utf8');
    const spec = validateProjectSpec(parseProjectSpec(manifest));
    createBuildPlan(spec);
    createRuntimePlan(spec);
    createRoutePlan(spec);

    for (const artifact of spec.artifacts) {
      await assertPathExists(
        path.join(targetDir, artifact.path),
        `${definition.id}: artifact path "${artifact.path}" does not exist`,
      );
    }

    for (const requiredPath of definition.requiredPaths) {
      await assertPathExists(
        path.join(targetDir, requiredPath),
        `${definition.id}: required architecture path "${requiredPath}" does not exist`,
      );
    }

    if (definition.requiredScripts?.length) {
      const packageJsonPath = path.join(targetDir, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8')) as {
        scripts?: Record<string, string>;
      };
      const scripts = packageJson.scripts ?? {};

      for (const scriptName of definition.requiredScripts) {
        if (!scripts[scriptName]) {
          throw new Error(`${definition.id}: required script "${scriptName}" is missing from package.json`);
        }
      }
    }

    for (const assertion of definition.fileAssertions) {
      const filePath = path.join(targetDir, assertion.path);
      await assertPathExists(filePath, `${definition.id}: expected file "${assertion.path}" does not exist`);

      for (const pattern of assertion.includes ?? []) {
        await assertFileIncludes(
          filePath,
          pattern,
          `${definition.id}: expected "${assertion.path}" to include "${pattern}"`,
        );
      }

      if (assertion.maxLines) {
        await assertFileMaxLines(
          filePath,
          assertion.maxLines,
          `${definition.id}: entrypoint "${assertion.path}" should stay under ${assertion.maxLines} lines`,
        );
      }
    }

    if (definition.installCommand) {
      await runCommand(withTargetDir(definition.installCommand, targetDir), `${definition.id} install`);
    }

    for (const qualityCommand of definition.qualityCommands) {
      await runCommand(withTargetDir(qualityCommand, targetDir), `${definition.id} quality`);
    }

    if (definition.buildCommand) {
      await runCommand(withTargetDir(definition.buildCommand, targetDir), `${definition.id} build`);
    }

    console.log(`${definition.id}: starting smoke check with ${commandToString(withTargetDir(definition.devCommand, targetDir))}`);
    await runDevSmokeCheck(withTargetDir(definition.devCommand, targetDir), definition.smokeCheck);
  }
}

void validateTemplate(parseTemplateArgs(process.argv.slice(2)).templateId).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
