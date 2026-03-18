import fs from 'node:fs/promises';
import path from 'node:path';

import { generateTemplate, getTemplateDefinitions } from './registry.js';
import { parseTemplateArgs, resetDir, templateDir, templatesRoot } from './shared.js';

async function main(): Promise<void> {
  const { templateId } = parseTemplateArgs(process.argv.slice(2));
  const definitions = getTemplateDefinitions(templateId);

  await fs.mkdir(templatesRoot(), { recursive: true });

  for (const definition of definitions) {
    const targetDir = templateDir(definition.id);
    console.log(`\n==> Generating ${definition.id} in ${path.relative(process.cwd(), targetDir)}`);
    await resetDir(targetDir);
    await generateTemplate(definition, targetDir);
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
