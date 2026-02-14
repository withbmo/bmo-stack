import { useState } from 'react';
import type { ProjectConfig } from '@/shared/types';

export function useProjectConfig(projectId: string | undefined) {
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: projectId || 'untitled',
    region: 'us-east-1',
    tier: 'free',
    envVars: [
      {
        id: '1',
        key: 'DATABASE_URL',
        value: 'postgresql://user:pass@localhost:5432/db',
      },
      { id: '2', key: 'DEBUG', value: 'True' },
    ],
    autoDeploy: true,
  });

  return { projectConfig, setProjectConfig };
}
