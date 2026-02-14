/**
 * Deployment-related types and contracts
 */

export interface DeployJobStep {
  key: string;
  title: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped';
}

export interface DeployJob {
  id: string;
  projectId: string;
  environmentId: string;
  triggeredByUserId: string | null;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled';
  currentStep: string | null;
  steps: DeployJobStep[];
  source: {
    origin: string;
    ref: string;
  };
  executionModeSnapshot: string;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  project?: {
    name: string;
    slug: string;
  };
  environment?: {
    name: string;
    displayName: string;
  };
}

export interface CreateDeployJobInput {
  projectId: string;
  environmentId: string;
  source?: {
    origin: string;
    ref: string;
  };
}
