import type { DeployJobStatus as ContractDeployJobStatus } from '@pytholit/contracts';

export type ProjectStatus = 'running' | 'stopped' | 'building' | 'error';

export type DeploymentStatus = 'live' | 'stopped' | 'deploying' | 'failed';

export type DeployJobStatus = ContractDeployJobStatus;

export interface PricingPlan {
  id?: string;
  name: string;
  price?: string;
  period?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: Array<string | { name: string; included?: boolean }>;
  recommended?: boolean;
  buttonText?: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  stars: number;
  isOfficial: boolean;
}

export interface HubResource {
  id: string;
  type: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  stars: number;
  forks: number;
  updatedAt: string;
  verified?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  pythonCode: string;
  icon: string;
}
