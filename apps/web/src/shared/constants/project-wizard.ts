import type { LucideIcon } from 'lucide-react';
import { Database,Layers, Server } from 'lucide-react';
import React from 'react';

export interface TechStackOption {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<{ size?: number }>;
  description: string;
}

export interface StructureOption {
  id: string;
  name: string;
  description: string;
}

export interface ToolingOption {
  key: 'dockerfile' | 'dockerCompose' | 'typeHinting' | 'formatters' | 'makefile' | 'testingFolder';
  label: string;
}

// Helper for Zap icon (custom SVG) - no JSX so file stays .ts
const ZapIcon: React.FC<{ size?: number }> = ({ size = 20 }) =>
  React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    React.createElement('polygon', {
      points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2',
    })
  );

// Framework options
export const FRAMEWORKS: TechStackOption[] = [
  {
    id: 'fastapi',
    name: 'FastAPI',
    icon: Server,
    description: 'High performance async API',
  },
  {
    id: 'django',
    name: 'Django',
    icon: Layers,
    description: 'Batteries-included web framework',
  },
];

// Database options
export const DATABASES: TechStackOption[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    icon: Database,
    description: 'Relational SQL Database',
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: ZapIcon,
    description: 'In-memory Data Structure Store',
  },
  {
    id: 'mongo',
    name: 'MongoDB',
    icon: Database,
    description: 'NoSQL Document Database',
  },
];

// FastAPI project structures
export const FASTAPI_STRUCTURES: StructureOption[] = [
  { id: 'nested', name: 'Nested', description: 'Models/routers by feature (nested folders)' },
  { id: 'flat', name: 'Flat', description: 'Flat structure (all in few modules)' },
];

// Django project structures
export const DJANGO_STRUCTURES: StructureOption[] = [
  { id: 'apps', name: 'Apps-based', description: 'Standard Django apps per feature' },
  { id: 'flat', name: 'Flat', description: 'Minimal apps, flat module layout' },
];

// Project wizard config shape
export interface ProjectWizardConfig {
  name: string;
  description: string;
  framework: 'fastapi' | 'django';
  databases: string[];
  dockerfile: boolean;
  dockerCompose: boolean;
  typeHinting: boolean;
  typeHintingLevel: 'basic' | 'strict' | 'mypy' | 'pyright';
  formatters: boolean;
  formatterChoice: 'black' | 'ruff' | 'autopep8' | 'yapf';
  dependencyManager: 'uv' | 'poetry' | 'requirements.txt';
  makefile: boolean;
  testingFolder: boolean;
  structure: string;
  alembic: boolean;
  repoUrl: string;
  repoBranch: string;
  buildCommand: string;
  startCommand: string;
  dockerfilePath: string;
  visibility: 'private' | 'public';
  region: string;
  autoDeploy: boolean;
  repoExportEnabled: boolean;
  runtimePreset: 'small' | 'medium' | 'large';
  cpu: number;
  memory: number;
  port: number;
  envVars: { id: string; key: string; value: string }[];
}

export const DEFAULT_PROJECT_CONFIG: ProjectWizardConfig = {
  name: '',
  description: '',
  framework: 'fastapi',
  databases: [],
  dockerfile: true,
  dockerCompose: false,
  typeHinting: true,
  typeHintingLevel: 'basic',
  formatters: true,
  formatterChoice: 'black',
  dependencyManager: 'uv',
  makefile: false,
  testingFolder: true,
  structure: 'nested',
  alembic: false,
  repoUrl: '',
  repoBranch: 'main',
  buildCommand: '',
  startCommand: '',
  dockerfilePath: 'Dockerfile',
  visibility: 'private',
  region: 'us-east-1',
  autoDeploy: true,
  repoExportEnabled: false,
  runtimePreset: 'small',
  cpu: 512,
  memory: 1024,
  port: 8000,
  envVars: [{ id: 'env-1', key: '', value: '' }],
};

// Tooling options
export const TOOLING_OPTIONS: ToolingOption[] = [
  { key: 'dockerCompose', label: 'Docker Compose' },
  { key: 'typeHinting', label: 'Type hinting' },
  { key: 'formatters', label: 'Formatters' },
  { key: 'makefile', label: 'Makefile' },
  { key: 'testingFolder', label: 'Testing folder' },
];
