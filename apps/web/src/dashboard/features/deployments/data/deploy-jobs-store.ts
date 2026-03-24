import { DEPLOY_JOB_STATUS, DEPLOY_JOB_STEP_STATUS } from '@pytholit/contracts';

import type { DeployJobStep, DeployJobViewModel, DeployStepStatus } from '@/shared/types';

const BASE_STEPS: DeployJobStep[] = [
  { key: 'validate', title: 'Validate config', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
  { key: 'prepare', title: 'Prepare build context', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
  { key: 'mock_build', title: 'Build image (mock)', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
  { key: 'mock_deploy', title: 'Deploy (mock)', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
  { key: 'finalize', title: 'Finalize', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
];

let deployJobs: DeployJobViewModel[] = [
  {
    id: 'job-001',
    projectId: 'p-001',
    triggeredBy: 'user_01',
    status: DEPLOY_JOB_STATUS.SUCCEEDED,
    currentStep: null,
    steps: BASE_STEPS.map(step => ({ ...step, status: DEPLOY_JOB_STEP_STATUS.SUCCEEDED })),
    source: { commit: 'a1b2c3d', origin: 'repo' },
    createdAt: '2026-02-05T10:22:00Z',
    startedAt: '2026-02-05T10:22:05Z',
    finishedAt: '2026-02-05T10:23:12Z',
  },
  {
    id: 'job-002',
    projectId: 'p-002',
    triggeredBy: 'user_01',
    status: DEPLOY_JOB_STATUS.RUNNING,
    currentStep: 'mock_build',
    steps: [
      { key: 'validate', title: 'Validate config', status: DEPLOY_JOB_STEP_STATUS.SUCCEEDED },
      { key: 'prepare', title: 'Prepare build context', status: DEPLOY_JOB_STEP_STATUS.SUCCEEDED },
      { key: 'mock_build', title: 'Build image (mock)', status: DEPLOY_JOB_STEP_STATUS.RUNNING },
      { key: 'mock_deploy', title: 'Deploy (mock)', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
      { key: 'finalize', title: 'Finalize', status: DEPLOY_JOB_STEP_STATUS.QUEUED },
    ],
    source: { commit: 'e4f5g6h', origin: 'repo' },
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

export const createDeployJob = (job: DeployJobViewModel) => {
  deployJobs = [job, ...deployJobs];
  notify();
};

export const updateDeployJob = (
  jobId: string,
  updater: (job: DeployJobViewModel) => DeployJobViewModel
) => {
  deployJobs = deployJobs.map(job => (job.id === jobId ? updater(job) : job));
  notify();
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const updateStepStatus = (steps: DeployJobStep[], stepKey: string, status: DeployStepStatus) =>
  steps.map(step => (step.key === stepKey ? { ...step, status } : step));

export const cancelDeployJob = (jobId: string) => {
  updateDeployJob(jobId, job => {
    if (job.status === DEPLOY_JOB_STATUS.SUCCEEDED || job.status === DEPLOY_JOB_STATUS.FAILED)
      return job;
    const steps: DeployJobStep[] = job.steps.map(step =>
      step.status === DEPLOY_JOB_STEP_STATUS.QUEUED
        ? { ...step, status: DEPLOY_JOB_STEP_STATUS.SKIPPED }
        : step
    );
    return {
      ...job,
      status: DEPLOY_JOB_STATUS.CANCELED,
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
    status: DEPLOY_JOB_STATUS.RUNNING,
    startedAt: job.startedAt ?? new Date().toISOString(),
  }));

  for (const step of BASE_STEPS) {
    const latest = getDeployJobById(jobId);
    if (!latest || latest.status !== DEPLOY_JOB_STATUS.RUNNING) break;

    updateDeployJob(jobId, job => ({
      ...job,
      currentStep: step.key,
      steps: updateStepStatus(job.steps, step.key, DEPLOY_JOB_STEP_STATUS.RUNNING),
    }));

    await sleep(1200);

    const afterRun = getDeployJobById(jobId);
    if (!afterRun || afterRun.status !== DEPLOY_JOB_STATUS.RUNNING) break;

    updateDeployJob(jobId, job => ({
      ...job,
      steps: updateStepStatus(job.steps, step.key, DEPLOY_JOB_STEP_STATUS.SUCCEEDED),
    }));
  }

  const final = getDeployJobById(jobId);
  if (final && final.status === DEPLOY_JOB_STATUS.RUNNING) {
    updateDeployJob(jobId, job => ({
      ...job,
      status: DEPLOY_JOB_STATUS.SUCCEEDED,
      currentStep: null,
      finishedAt: new Date().toISOString(),
    }));
  }

  runningJobs.delete(jobId);
};

export const buildBaseSteps = () => BASE_STEPS.map(step => ({ ...step }));
