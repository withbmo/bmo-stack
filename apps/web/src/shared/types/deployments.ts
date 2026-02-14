import type { ExecutionMode } from './environments';

export type DeploymentStatus = 'deploying' | 'live' | 'failed' | 'stopped';

export interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  status: DeploymentStatus;
  region: string;
  deployedAt: string;
  url?: string;
  buildDuration?: number;
}

export type DeployJobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled';

export type DeployStepStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped';

export interface DeployJobStep {
  key: string;
  title: string;
  status: DeployStepStatus;
}

export interface DeployJob {
  id: string;
  projectId: string;
  environmentId: string;
  triggeredBy: string;
  status: DeployJobStatus;
  currentStep: string | null;
  steps: DeployJobStep[];
  source: Record<string, unknown>;
  executionModeSnapshot: ExecutionMode;
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}
