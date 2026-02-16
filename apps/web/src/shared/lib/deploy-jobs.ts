import type {
  DeployJob as ContractDeployJob,
  DeployJobStep as ContractDeployJobStep,
} from '@pytholit/contracts';

import type { DeployJob as ViewDeployJob, DeployJobStep as ViewDeployJobStep } from '../types';
import { API_V1, apiRequest, snakeToCamel } from './client';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.

type ApiDeployJob = ContractDeployJob;

const mapStepStatus = (status: ContractDeployJobStep['status']): ViewDeployJobStep['status'] =>
  status;

const mapDeployJob = (job: ApiDeployJob): ViewDeployJob => ({
  id: job.id,
  projectId: job.projectId,
  environmentId: job.environmentId,
  triggeredBy: job.triggeredByUserId ? `user_${job.triggeredByUserId}` : 'system',
  status: job.status,
  currentStep: job.currentStep ?? null,
  steps: job.steps.map(step => ({
    ...step,
    status: mapStepStatus(step.status),
  })),
  source: job.source as Record<string, unknown>,
  executionModeSnapshot: job.executionModeSnapshot === 'byo_aws' ? 'byo_aws' : 'managed',
  createdAt: job.createdAt,
  startedAt: job.startedAt ?? null,
  finishedAt: job.finishedAt ?? null,
});

export async function listDeployJobs(
  token: string | undefined,
  params: { projectId?: string; envId?: string }
): Promise<ViewDeployJob[]> {
  const query = new URLSearchParams();
  if (params.projectId) query.set('project_id', params.projectId);
  if (params.envId) query.set('env_id', params.envId);
  const path = `${API_V1}/deploy-jobs${query.toString() ? `?${query}` : ''}`;
  const jobs = snakeToCamel(await apiRequest<ApiDeployJob[]>(path, { method: 'GET', token }));
  return jobs.map(mapDeployJob);
}

export async function getDeployJob(token: string | undefined, jobId: string): Promise<ViewDeployJob> {
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
    environmentId: string;
    source?: { origin: string; ref: string };
  }
): Promise<ViewDeployJob> {
  const job = snakeToCamel(
    await apiRequest<ApiDeployJob>(`${API_V1}/deploy-jobs`, {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapDeployJob(job);
}

export async function cancelDeployJob(token: string | undefined, jobId: string): Promise<ViewDeployJob> {
  const job = snakeToCamel(
    await apiRequest<ApiDeployJob>(`${API_V1}/deploy-jobs/${jobId}/cancel`, {
      method: 'POST',
      token,
    })
  );
  return mapDeployJob(job);
}
