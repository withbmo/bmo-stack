export interface WizardFieldOption {
  label: string;
  value: string;
}

export interface WizardField {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multi';
  required?: boolean;
  options?: WizardFieldOption[];
  default?: unknown;
}

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: WizardField[];
}

export interface WizardSchema {
  id: string;
  version: string;
  title: string;
  steps: WizardStep[];
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
