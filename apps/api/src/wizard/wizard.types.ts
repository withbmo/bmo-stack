export type WizardInput = Record<string, unknown>;

export interface WizardSchema {
  id: string;
  version: string;
  title: string;
  steps: WizardStep[];
  rules: WizardRules;
}

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: WizardField[];
}

interface WizardField {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multi';
  required?: boolean;
  options?: { label: string; value: string }[];
  default?: unknown;
}

interface WizardRules {
  files: Record<string, WizardFileRule>;
}

interface WizardFileRule {
  base?: string;
  variants?: WizardRuleVariant[];
  addons?: WizardRuleVariant[];
}

interface WizardRuleVariant {
  when: Record<string, unknown>;
  use: string;
}

interface WizardManifestFile {
  path: string;
  content: string;
  language?: string;
}

export interface WizardManifest {
  id: string;
  version: string;
  projectName?: string;
  entryFile?: string;
  generatedAt: string;
  files: WizardManifestFile[];
}

export interface BlueprintLock {
  id: string;
  version: string;
  schemaVersion: string;
  inputs: WizardInput;
  resolvedParts: Record<string, string[]>;
  files: { path: string; sha256: string }[];
  generatedAt: string;
}

export interface WizardTemplateSummary {
  templateId: string;
  title: string;
  versions: string[];
  latestVersion: string;
}
