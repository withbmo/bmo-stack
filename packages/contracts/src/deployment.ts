/**
 * Deployment-related types and contracts
 */

export const DEPLOY_JOB_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
} as const;
export type DeployJobStatus = (typeof DEPLOY_JOB_STATUS)[keyof typeof DEPLOY_JOB_STATUS];

export const DEPLOY_JOB_STEP_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  SKIPPED: 'skipped',
} as const;
export type DeployJobStepStatus = (typeof DEPLOY_JOB_STEP_STATUS)[keyof typeof DEPLOY_JOB_STEP_STATUS];

export interface DeployJobStep {
  key: string;
  title: string;
  status: DeployJobStepStatus;
}

export interface DeployJob {
  id: string;
  projectId: string;
  environmentId: string;
  triggeredByUserId: string | null;
  status: DeployJobStatus;
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
    envType: string;
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
