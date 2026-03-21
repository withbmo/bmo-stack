type ProjectVisibility = 'public' | 'private';

export interface Template {
  id: string;
  title: string;
  description: string;
  framework: string;
  author: string;
  stars: string | number;
  tags: string[];
  isOfficial?: boolean;
  parts?: TemplateParts;
}

export interface TemplateParts {
  framework: 'fastapi' | 'django';
  databases: string[];
  structure: string;
  dependencyManager: 'uv' | 'poetry' | 'requirements.txt';
  tooling: {
    dockerCompose?: boolean;
    typeHinting?: boolean;
    typeHintingLevel?: 'basic' | 'strict' | 'mypy' | 'pyright';
    formatters?: boolean;
    formatterChoice?: 'black' | 'ruff' | 'autopep8' | 'yapf';
    makefile?: boolean;
    testingFolder?: boolean;
    alembic?: boolean;
  };
  runtimePreset: 'small' | 'medium' | 'large';
  cpu: number;
  memory: number;
  port: number;
  visibility: ProjectVisibility;
  region: string;
  envVars: { key: string; value: string }[];
}
