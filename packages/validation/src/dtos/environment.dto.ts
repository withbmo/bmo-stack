import { IsString, IsOptional, IsIn, IsObject, MinLength, MaxLength } from 'class-validator';

/**
 * Environment validation constants
 */
export const ENVIRONMENT_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  EXECUTION_MODES: ['managed', 'byo_aws'] as const,
  VISIBILITY_OPTIONS: ['public', 'private'] as const,
  ENVIRONMENT_CLASSES: ['dev', 'prod'] as const,
  TIER_POLICIES: ['free', 'pro', 'enterprise'] as const,
  REGIONS: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'] as const,
};

/**
 * Create Environment DTO
 */
export class CreateEnvironmentDto {
  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_NAME_LENGTH)
  name!: string;

  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_NAME_LENGTH)
  displayName!: string;

  /**
   * Explicit environment classification used for provisioning policy.
   */
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.ENVIRONMENT_CLASSES])
  environmentClass!: (typeof ENVIRONMENT_CONSTANTS.ENVIRONMENT_CLASSES)[number];

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.TIER_POLICIES])
  tierPolicy?: string;

  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.EXECUTION_MODES])
  executionMode!: (typeof ENVIRONMENT_CONSTANTS.EXECUTION_MODES)[number];

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.REGIONS])
  region?: (typeof ENVIRONMENT_CONSTANTS.REGIONS)[number];

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.VISIBILITY_OPTIONS])
  visibility?: (typeof ENVIRONMENT_CONSTANTS.VISIBILITY_OPTIONS)[number];

  // Stored into Environment.config (JSONB). Shape is product-defined.
  @IsOptional()
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}

/**
 * Update Environment DTO
 */
export class UpdateEnvironmentDto {
  @IsOptional()
  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_NAME_LENGTH)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_NAME_LENGTH)
  displayName?: string;

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.TIER_POLICIES])
  tierPolicy?: string;

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.EXECUTION_MODES])
  executionMode?: (typeof ENVIRONMENT_CONSTANTS.EXECUTION_MODES)[number];

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.REGIONS])
  region?: (typeof ENVIRONMENT_CONSTANTS.REGIONS)[number];

  @IsOptional()
  @IsString()
  @IsIn([...ENVIRONMENT_CONSTANTS.VISIBILITY_OPTIONS])
  visibility?: (typeof ENVIRONMENT_CONSTANTS.VISIBILITY_OPTIONS)[number];

  @IsOptional()
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}

export class CreateEnvironmentSessionDto {
  @IsOptional()
  @IsString()
  serviceKey?: string;
}

export class SetEnvironmentAccessModeDto {
  @IsString()
  @IsIn(['site_only', 'api_key_enabled'])
  mode!: 'site_only' | 'api_key_enabled';
}
