import type {
  DeployJobStep as ContractDeployJobStep,
  DeployJobStatus,
  DeployJobStepStatus,
} from '@pytholit/contracts';

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

export type { DeployJobStatus, DeployJobStepStatus };
export type DeployStepStatus = DeployJobStepStatus;

export type DeployJobStep = ContractDeployJobStep;

export interface DeployJobViewModel {
  id: string;
  projectId: string;
  triggeredBy: string;
  status: DeployJobStatus;
  currentStep: string | null;
  steps: DeployJobStep[];
  source: Record<string, unknown>;
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}
