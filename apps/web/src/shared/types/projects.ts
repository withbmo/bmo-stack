export type ProjectStatus = 'running' | 'stopped' | 'building' | 'error';
export type ProjectLifecycleState = 'active' | 'archived';

export interface Project {
  id: string;
  name: string;
  framework: string;
  region: string;
  status: ProjectStatus;
  lifecycleState: ProjectLifecycleState;
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
