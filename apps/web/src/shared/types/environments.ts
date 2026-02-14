export type ExecutionMode = 'managed' | 'byo_aws';
export type EnvironmentVisibility = 'public' | 'private';
export type EnvironmentName = 'dev' | 'prod';

export type EnvironmentOrchestratorStatus =
  | 'queued'
  | 'starting'
  | 'ready'
  | 'stopping'
  | 'stopped'
  | 'terminating'
  | 'terminated'
  | 'failed'
  | 'unknown';

export interface EnvironmentOrchestratorInfo {
  status: EnvironmentOrchestratorStatus;
  message?: string | null;
  ts?: string | null;
  request_id?: string | null;
  resource_type?: string | null;
  resource_id?: string | null;
  details?: Record<string, unknown>;
  last_error?: string | null;
}

export interface Environment {
  id: string;
  name: EnvironmentName;
  displayName: string;
  executionMode: ExecutionMode;
  region?: string | null;
  visibility: EnvironmentVisibility;
  config?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
