import type { DeployJob, DeployJobStep, DeployStepStatus } from '@/shared/types';

const BASE_STEPS: DeployJobStep[] = [
  { key: 'validate', title: 'Validate config', status: 'queued' },
  { key: 'prepare', title: 'Prepare build context', status: 'queued' },
  { key: 'mock_build', title: 'Build image (mock)', status: 'queued' },
  { key: 'mock_deploy', title: 'Deploy (mock)', status: 'queued' },
  { key: 'finalize', title: 'Finalize', status: 'queued' },
];

let deployJobs: DeployJob[] = [
  {
    id: 'job-001',
    projectId: 'p-001',
    environmentId: 'env-001',
    triggeredBy: 'user_01',
    status: 'succeeded',
    currentStep: null,
    steps: BASE_STEPS.map(step => ({ ...step, status: 'succeeded' })),
    source: { commit: 'a1b2c3d', origin: 'repo' },
    executionModeSnapshot: 'managed',
    createdAt: '2026-02-05T10:22:00Z',
    startedAt: '2026-02-05T10:22:05Z',
    finishedAt: '2026-02-05T10:23:12Z',
  },
  {
    id: 'job-002',
    projectId: 'p-002',
    environmentId: 'env-004',
    triggeredBy: 'user_01',
    status: 'running',
    currentStep: 'mock_build',
    steps: [
      { key: 'validate', title: 'Validate config', status: 'succeeded' },
      { key: 'prepare', title: 'Prepare build context', status: 'succeeded' },
      { key: 'mock_build', title: 'Build image (mock)', status: 'running' },
      { key: 'mock_deploy', title: 'Deploy (mock)', status: 'queued' },
      { key: 'finalize', title: 'Finalize', status: 'queued' },
    ],
    source: { commit: 'e4f5g6h', origin: 'repo' },
    executionModeSnapshot: 'byo_aws',
    createdAt: '2026-02-06T14:10:00Z',
    startedAt: '2026-02-06T14:10:06Z',
    finishedAt: null,
  },
];

const listeners = new Set<() => void>();
const runningJobs = new Set<string>();

const notify = () => {
  listeners.forEach(listener => listener());
};

export const subscribeDeployJobs = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getDeployJobs = () => deployJobs;

export const getDeployJobById = (jobId: string) => deployJobs.find(job => job.id === jobId) || null;

export const createDeployJob = (job: DeployJob) => {
  deployJobs = [job, ...deployJobs];
  notify();
};

export const updateDeployJob = (jobId: string, updater: (job: DeployJob) => DeployJob) => {
  deployJobs = deployJobs.map(job => (job.id === jobId ? updater(job) : job));
  notify();
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const updateStepStatus = (steps: DeployJobStep[], stepKey: string, status: DeployStepStatus) =>
  steps.map(step => (step.key === stepKey ? { ...step, status } : step));

export const cancelDeployJob = (jobId: string) => {
  updateDeployJob(jobId, job => {
    if (job.status === 'succeeded' || job.status === 'failed') return job;
    const steps: DeployJobStep[] = job.steps.map(step =>
      step.status === 'queued' ? { ...step, status: 'skipped' as DeployStepStatus } : step
    );
    return {
      ...job,
      status: 'canceled',
      currentStep: null,
      steps,
      finishedAt: new Date().toISOString(),
    };
  });
};

export const startMockDeploy = async (jobId: string) => {
  if (runningJobs.has(jobId)) return;
  runningJobs.add(jobId);

  updateDeployJob(jobId, job => ({
    ...job,
    status: 'running',
    startedAt: job.startedAt ?? new Date().toISOString(),
  }));

  for (const step of BASE_STEPS) {
    const latest = getDeployJobById(jobId);
    if (!latest || latest.status !== 'running') break;

    updateDeployJob(jobId, job => ({
      ...job,
      currentStep: step.key,
      steps: updateStepStatus(job.steps, step.key, 'running'),
    }));

    await sleep(1200);

    const afterRun = getDeployJobById(jobId);
    if (!afterRun || afterRun.status !== 'running') break;

    updateDeployJob(jobId, job => ({
      ...job,
      steps: updateStepStatus(job.steps, step.key, 'succeeded'),
    }));
  }

  const final = getDeployJobById(jobId);
  if (final && final.status === 'running') {
    updateDeployJob(jobId, job => ({
      ...job,
      status: 'succeeded',
      currentStep: null,
      finishedAt: new Date().toISOString(),
    }));
  }

  runningJobs.delete(jobId);
};

export const buildBaseSteps = () => BASE_STEPS.map(step => ({ ...step }));
