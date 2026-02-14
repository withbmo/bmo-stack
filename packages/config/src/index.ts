/**
 * Shared configuration and constants
 */

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
  regions: [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  ],
  executionModes: [
    { value: 'managed', label: 'Managed (Pytholit Infrastructure)' },
    { value: 'byo_aws', label: 'Bring Your Own AWS' },
  ],
} as const;

export const PLAN_FEATURES = {
  free: {
    maxProjects: 3,
    maxEnvironments: 2,
    maxDeployments: 10,
    maxStorage: 1, // GB
    support: 'community',
  },
  pro: {
    maxProjects: 25,
    maxEnvironments: 10,
    maxDeployments: 100,
    maxStorage: 50, // GB
    support: 'email',
  },
  enterprise: {
    maxProjects: 'unlimited',
    maxEnvironments: 'unlimited',
    maxDeployments: 'unlimited',
    maxStorage: 'unlimited',
    support: '24/7',
  },
} as const;

export type { Plan, PlanFeature, PlanFeatureValue, PublicPlan } from './plans';
export {
  CREDITS_PER_USD,
  DEFAULT_PLAN_ID,
  getCreditsForUsd,
  getDefaultPlan,
  getPlanById,
  getPlanByPriceId,
  getPlanCredits,
  getPlans,
  getPublicPlans,
  getStripePriceId,
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
