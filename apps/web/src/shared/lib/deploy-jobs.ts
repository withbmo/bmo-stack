import type {
  DeployJob as ContractDeployJob,
  DeployJobStep as ContractDeployJobStep,
} from '@pytholit/contracts';

import type {
  DeployJobStep as DeployJobStepViewModel,
  DeployJobViewModel,
} from '../types';
import { API_V1, apiRequest, snakeToCamel } from './client';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.

type ApiDeployJob = ContractDeployJob;

const mapStepStatus = (status: ContractDeployJobStep['status']): DeployJobStepViewModel['status'] =>
  status;

const mapDeployJob = (job: ApiDeployJob): DeployJobViewModel => ({
  id: job.id,
  projectId: job.projectId,
  triggeredBy: job.triggeredByUserId ? `user_${job.triggeredByUserId}` : 'system',
  status: job.status,
  currentStep: job.currentStep ?? null,
  steps: job.steps.map(step => ({
    ...step,
    status: mapStepStatus(step.status),
  })),
  source: job.source as Record<string, unknown>,
  createdAt: job.createdAt,
  startedAt: job.startedAt ?? null,
  finishedAt: job.finishedAt ?? null,
});

export async function listDeployJobs(
  token: string | undefined,
  params: { projectId?: string }
): Promise<DeployJobViewModel[]> {
  const query = new URLSearchParams();
  if (params.projectId) query.set('project_id', params.projectId);
  const path = `${API_V1}/deploy-jobs${query.toString() ? `?${query}` : ''}`;
  const jobs = snakeToCamel(await apiRequest<ApiDeployJob[]>(path, { method: 'GET', token }));
  return jobs.map(mapDeployJob);
}

export async function getDeployJob(
  token: string | undefined,
  jobId: string
): Promise<DeployJobViewModel> {
  const job = snakeToCamel(
    await apiRequest<ApiDeployJob>(`${API_V1}/deploy-jobs/${jobId}`, {
      method: 'GET',
      token,
    })
  );
  return mapDeployJob(job);
}

export async function createDeployJob(
  token: string | undefined,
  payload: {
    projectId: string;
    source?: { origin: string; ref: string };
  }
): Promise<DeployJobViewModel> {
  const job = snakeToCamel(
    await apiRequest<ApiDeployJob>(`${API_V1}/deploy-jobs`, {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapDeployJob(job);
}

export async function cancelDeployJob(
  token: string | undefined,
  jobId: string
): Promise<DeployJobViewModel> {
  const job = snakeToCamel(
    await apiRequest<ApiDeployJob>(`${API_V1}/deploy-jobs/${jobId}/cancel`, {
      method: 'POST',
      token,
    })
  );
  return mapDeployJob(job);
}
