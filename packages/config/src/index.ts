/**
 * Shared configuration and constants
 */

import { ENVIRONMENT_REGION, EXECUTION_MODE } from '@pytholit/contracts';

const REGION_LABELS: Record<(typeof ENVIRONMENT_REGION)[keyof typeof ENVIRONMENT_REGION], string> = {
  [ENVIRONMENT_REGION.US_EAST_1]: 'US East (N. Virginia)',
  [ENVIRONMENT_REGION.US_WEST_2]: 'US West (Oregon)',
  [ENVIRONMENT_REGION.EU_WEST_1]: 'EU (Ireland)',
  [ENVIRONMENT_REGION.AP_SOUTHEAST_1]: 'Asia Pacific (Singapore)',
};

export const APP_CONFIG = {
  name: 'Pytholit',
  description: 'Cloud-based Python environment management platform',
  version: '2.0.0',
  company: 'Pytholit',
  website: 'https://pytholit.com',
  support: 'support@pytholit.com',
} as const;

export const API_CONFIG = {
  version: 'v1',
  timeout: 30000,
  retries: 3,
} as const;

export const AUTH_CONFIG = {
  tokenKey: 'pytholit_token',
  refreshTokenKey: 'pytholit_refresh_token',
  tokenExpiry: 3600, // 1 hour in seconds
  refreshTokenExpiry: 604800, // 7 days in seconds
} as const;

export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultPerPage: 20,
  maxPerPage: 100,
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxAvatarSize: 2 * 1024 * 1024, // 2MB
  maxProjectFileSize: 50 * 1024 * 1024, // 50MB
  allowedAvatarTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedProjectFileTypes: ['.py', '.txt', '.md', '.json', '.yaml', '.yml'],
} as const;

export const DEPLOYMENT_CONFIG = {
  pollInterval: 1500, // 1.5 seconds
  maxLogLines: 1000,
  timeout: 600000, // 10 minutes
} as const;

export const ENVIRONMENT_CONFIG = {
  regions: (Object.values(ENVIRONMENT_REGION) as (typeof ENVIRONMENT_REGION)[keyof typeof ENVIRONMENT_REGION][]).map(
    (value) => ({ value, label: REGION_LABELS[value] })
  ),
  executionModes: [
    { value: EXECUTION_MODE.MANAGED, label: 'Managed (Pytholit Infrastructure)' },
    { value: EXECUTION_MODE.BYO_AWS, label: 'Bring Your Own AWS' },
  ],
} as const;

export type {
  Plan,
  PlanBillingVariant,
  PlanFeature,
  PlanFeatureValue,
} from './plans';
export {
  CREDITS_PER_USD,
  DEFAULT_PLAN_ID,
  PLAN_CATALOG_VERSION,
  getCreditsForUsd,
  getPlanCatalogVersion,
  getPlanByCode,
  getDefaultPlan,
  getPlanById,
  getPlanCode,
  getPlanCredits,
  getPlans,
  getPlanVariant,
  PLANS,
} from './plans';

export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  docs: '/docs',
  apiPlayground: '/api-playground',

  // Auth
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  verifyOtp: '/auth/verify-otp',

  // Dashboard
  dashboard: '/dashboard',
  projects: '/dashboard/projects',
  newProject: '/dashboard/new',
  projectDetails: (id: string) => `/dashboard/projects/${id}`,

  environments: '/dashboard/environments',
  newEnvironment: '/dashboard/environments/new',

  deployments: '/dashboard/deployments',
  deploymentDetails: (id: string) => `/dashboard/deployments/${id}`,

  templates: '/dashboard/templates',
  hub: '/dashboard/hub',

  settings: '/dashboard/settings',
  settingsProfile: '/dashboard/settings/profile',
  settingsBilling: '/dashboard/settings/billing',
  settingsNotifications: '/dashboard/settings/notifications',

  editor: (projectId: string) => `/editor/${projectId}`,
} as const;
