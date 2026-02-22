export type {
  EnvironmentClass as EnvironmentEnvType,
  OrchestratorStatus as EnvironmentOrchestratorStatus,
  EnvironmentVisibility,
  ExecutionMode,
} from '@pytholit/contracts';

export interface EnvironmentOrchestratorInfo {
  status: import('@pytholit/contracts').OrchestratorStatus;
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
  envType: import('@pytholit/contracts').EnvironmentClass;
  displayName: string;
  executionMode: import('@pytholit/contracts').ExecutionMode;
  region?: string | null;
  visibility: import('@pytholit/contracts').EnvironmentVisibility;
  config?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
