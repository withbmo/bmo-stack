/**
 * Environment-related types and contracts
 */

export interface Environment {
  id: string;
  ownerId: string;
  name: string;
  displayName: string;
  tierPolicy: string | null;
  executionMode: 'managed' | 'byo_aws';
  region: string | null;
  visibility: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnvironmentInput {
  name: string;
  displayName: string;
  /**
   * Explicit environment classification used for provisioning policy.
   * Stored server-side in Environment.config.environmentClass.
   */
  environmentClass: 'dev' | 'prod';
  tierPolicy?: string;
  executionMode: 'managed' | 'byo_aws';
  region?: string;
  visibility?: 'public' | 'private';
}

export interface UpdateEnvironmentInput {
  name?: string;
  displayName?: string;
  tierPolicy?: string;
  visibility?: 'public' | 'private';
}
