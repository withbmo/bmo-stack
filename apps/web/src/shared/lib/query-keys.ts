/**
 * Centralized query keys for TanStack Query
 *
 * This module provides type-safe, consistent query keys for all data fetching hooks.
 * Using centralized keys ensures proper cache invalidation and prevents typos.
 */

export const queryKeys = {
  // Projects
  projects: () => ['projects'] as const,
  project: (id: string) => ['project', id] as const,

  // Environments
  environments: () => ['environments'] as const,
  environment: (id: string) => ['environment', id] as const,

  // Deploy Jobs
  deployJobs: (params: { projectId?: string; envId?: string }) =>
    ['deploy-jobs', params] as const,
  deployJob: (id: string) => ['deploy-job', id] as const,

  // Deployments (mock data)
  deployments: () => ['deployments'] as const,

  // Hub Resources
  hubResources: () => ['hub-resources'] as const,

  // User
  currentUser: () => ['current-user'] as const,

  // Billing
  subscription: () => ['subscription'] as const,
  plans: () => ['plans'] as const,
  invoices: () => ['invoices'] as const,
  paymentMethods: () => ['payment-methods'] as const,
} as const;
