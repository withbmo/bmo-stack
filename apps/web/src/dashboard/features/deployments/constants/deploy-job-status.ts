import type { DashboardTab } from '@pytholit/ui';

export type DeployJobStatusFilter =
  | 'all'
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export const DEPLOY_JOB_STATUS_TABS: DashboardTab[] = [
  { value: 'all', label: 'ALL' },
  { value: 'queued', label: 'QUEUED' },
  { value: 'running', label: 'RUNNING' },
  { value: 'succeeded', label: 'SUCCEEDED' },
  { value: 'failed', label: 'FAILED' },
  { value: 'canceled', label: 'CANCELED' },
];
