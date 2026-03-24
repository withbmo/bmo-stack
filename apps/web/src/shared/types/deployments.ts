import type {
  DeployJobStep as ContractDeployJobStep,
  DeployJobStatus,
} from '@pytholit/contracts';

export type DeploymentStatus = 'deploying' | 'live' | 'failed' | 'stopped';

export type { DeployJobStatus,  };

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
