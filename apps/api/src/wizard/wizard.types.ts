export type WizardInput = Record<string, unknown>;

export interface WizardSchema {
  id: string;
  version: string;
  title: string;
  steps: WizardStep[];
  rules: WizardRules;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: WizardField[];
}

export interface WizardField {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multi';
  required?: boolean;
  options?: { label: string; value: string }[];
  default?: unknown;
}

export interface WizardRules {
  files: Record<string, WizardFileRule>;
}

export interface WizardFileRule {
  base?: string;
  variants?: WizardRuleVariant[];
  addons?: WizardRuleVariant[];
}

export interface WizardRuleVariant {
  when: Record<string, unknown>;
  use: string;
}

export interface WizardManifestFile {
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

