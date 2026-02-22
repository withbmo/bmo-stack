/**
 * Environment-related types, enums, and contracts.
 *
 * All string union values live here as `as const` objects so they can be used
 * as both runtime values and TypeScript types, imported from a single source
 * of truth across the API, orchestrator, and frontend.
 */

// ---------------------------------------------------------------------------
// Enums (const objects — usable as values AND types)
// ---------------------------------------------------------------------------

export const ORCHESTRATOR_STATUS = {
  QUEUED: 'queued',
  STARTING: 'starting',
  READY: 'ready',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
  TERMINATING: 'terminating',
  TERMINATED: 'terminated',
  FAILED: 'failed',
  UNKNOWN: 'unknown',
} as const;
export type OrchestratorStatus = (typeof ORCHESTRATOR_STATUS)[keyof typeof ORCHESTRATOR_STATUS];

export const ENVIRONMENT_CLASS = {
  DEV: 'dev',
  PROD: 'prod',
} as const;
export type EnvironmentClass = (typeof ENVIRONMENT_CLASS)[keyof typeof ENVIRONMENT_CLASS];

export const ENVIRONMENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;
export type EnvironmentVisibility = (typeof ENVIRONMENT_VISIBILITY)[keyof typeof ENVIRONMENT_VISIBILITY];

export const EXECUTION_MODE = {
  MANAGED: 'managed',
  BYO_AWS: 'byo_aws',
} as const;
export type ExecutionMode = (typeof EXECUTION_MODE)[keyof typeof EXECUTION_MODE];

export const TIER_POLICY = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;
export type TierPolicy = (typeof TIER_POLICY)[keyof typeof TIER_POLICY];

export const ACCESS_MODE = {
  SITE_ONLY: 'site_only',
  API_KEY_ENABLED: 'api_key_enabled',
} as const;
export type AccessMode = (typeof ACCESS_MODE)[keyof typeof ACCESS_MODE];

export const ENVIRONMENT_REGION = {
  US_EAST_1: 'us-east-1',
  US_WEST_2: 'us-west-2',
  EU_WEST_1: 'eu-west-1',
  AP_SOUTHEAST_1: 'ap-southeast-1',
} as const;
export type EnvironmentRegion = (typeof ENVIRONMENT_REGION)[keyof typeof ENVIRONMENT_REGION];

export const CONFIG_MODE = { PRESET: 'preset', CUSTOM: 'custom' } as const;
export type ConfigMode = (typeof CONFIG_MODE)[keyof typeof CONFIG_MODE];

export const MARKET_TYPE = { ON_DEMAND: 'on-demand', SPOT: 'spot' } as const;
export type MarketType = (typeof MARKET_TYPE)[keyof typeof MARKET_TYPE];

export const EC2_ARCHITECTURE = { X86_64: 'x86_64', ARM64: 'arm64' } as const;
export type Ec2Architecture = (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE];

export const ROOT_VOLUME_TYPE = { GP3: 'gp3', ST1: 'st1', SC1: 'sc1' } as const;
export type RootVolumeType = (typeof ROOT_VOLUME_TYPE)[keyof typeof ROOT_VOLUME_TYPE];

export const EC2_INSTANCE_STATE = {
  PENDING: 'pending',
  RUNNING: 'running',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
  TERMINATED: 'terminated',
  SHUTTING_DOWN: 'shutting-down',
} as const;
export type Ec2InstanceState = (typeof EC2_INSTANCE_STATE)[keyof typeof EC2_INSTANCE_STATE];

// ---------------------------------------------------------------------------
// Server Presets — single source of truth for all apps
// ---------------------------------------------------------------------------

export interface ServerPreset {
  id: string;
  label: string;
  region: string;
  /** AWS EC2 instance type launched for this preset */
  instanceType: string;
  cpu: string;
  memory: string;
  storage: string;
  network: string;
}

export const SERVER_PRESETS: readonly ServerPreset[] = [
  {
    id: 'balanced-us-east-1',
    label: 'Balanced (US East)',
    region: ENVIRONMENT_REGION.US_EAST_1,
    instanceType: 't3.small',
    cpu: '2 vCPU',
    memory: '4 GB RAM',
    storage: '80 GB SSD',
    network: '1 Gbps',
  },
  {
    id: 'compute-eu-west-1',
    label: 'Compute (EU West)',
    region: ENVIRONMENT_REGION.EU_WEST_1,
    instanceType: 't3.medium',
    cpu: '4 vCPU',
    memory: '8 GB RAM',
    storage: '160 GB SSD',
    network: '2 Gbps',
  },
  {
    id: 'edge-ap-southeast-1',
    label: 'Edge (AP Southeast)',
    region: ENVIRONMENT_REGION.AP_SOUTHEAST_1,
    instanceType: 't3.small',
    cpu: '2 vCPU',
    memory: '4 GB RAM',
    storage: '100 GB SSD',
    network: '1 Gbps',
  },
] as const;

// ---------------------------------------------------------------------------
// API shapes
// ---------------------------------------------------------------------------

export interface Environment {
  id: string;
  ownerId: string;
  envType: string;
  displayName: string;
  tierPolicy: TierPolicy | null;
  executionMode: ExecutionMode;
  region: string | null;
  visibility: EnvironmentVisibility;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnvironmentInput {
  envType: string;
  displayName: string;
  /** Explicit environment classification used for provisioning policy. */
  environmentClass: EnvironmentClass;
  tierPolicy?: TierPolicy;
  executionMode: ExecutionMode;
  region?: EnvironmentRegion;
  visibility?: EnvironmentVisibility;
}

export interface UpdateEnvironmentInput {
  envType?: string;
  displayName?: string;
  tierPolicy?: TierPolicy;
  visibility?: EnvironmentVisibility;
}
