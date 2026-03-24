import type { Project as ContractProject } from '@pytholit/contracts';

export type ProjectStatus = 'running' | 'stopped' | 'building' | 'error';

export interface ProjectViewModel {
  id: string;
  name: string;
  framework: string;
  region: string;
  status: ProjectStatus;
  lifecycleState: ContractProject['lifecycleState'];
  archivedAt: string | null;
  lastDeployed: string;
  cpuUsage: number;
  memoryUsage: number;
}

export interface ProjectConfig {
  name: string;
  region: string;
  tier: 'free' | 'pro' | 'scale';
  envVars: { id: string; key: string; value: string }[];
  autoDeploy: boolean;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
