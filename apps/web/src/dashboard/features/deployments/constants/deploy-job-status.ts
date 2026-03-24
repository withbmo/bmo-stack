import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';

export type DeployJobStatusFilter =
  | 'all'
  | (typeof DEPLOY_JOB_STATUS)[keyof typeof DEPLOY_JOB_STATUS];

interface DeployJobStatusTab {
  value: DeployJobStatusFilter;
  label: string;
}

export const DEPLOY_JOB_STATUS_TABS: DeployJobStatusTab[] = [
  { value: 'all', label: 'ALL' },
  { value: DEPLOY_JOB_STATUS.QUEUED, label: 'QUEUED' },
  { value: DEPLOY_JOB_STATUS.RUNNING, label: 'RUNNING' },
  { value: DEPLOY_JOB_STATUS.SUCCEEDED, label: 'SUCCEEDED' },
  { value: DEPLOY_JOB_STATUS.FAILED, label: 'FAILED' },
  { value: DEPLOY_JOB_STATUS.CANCELED, label: 'CANCELED' },
];
