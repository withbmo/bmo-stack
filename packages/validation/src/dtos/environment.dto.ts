import { IsString, IsOptional, IsIn, IsObject, MinLength, MaxLength } from 'class-validator';
import {
  ACCESS_MODE,
  ENVIRONMENT_CLASS,
  ENVIRONMENT_REGION,
  ENVIRONMENT_VISIBILITY,
  EXECUTION_MODE,
  TIER_POLICY,
} from '@pytholit/contracts';

/**
 * Environment validation constants — derived from @pytholit/contracts enums.
 * Add new values to the contracts package, not here.
 */
export const ENVIRONMENT_CONSTANTS = {
  MIN_ENV_TYPE_LENGTH: 1,
  MAX_ENV_TYPE_LENGTH: 100,
  MIN_DISPLAY_NAME_LENGTH: 1,
  MAX_DISPLAY_NAME_LENGTH: 100,
  EXECUTION_MODES: Object.values(EXECUTION_MODE) as [string, ...string[]],
  VISIBILITY_OPTIONS: Object.values(ENVIRONMENT_VISIBILITY) as [string, ...string[]],
  ENVIRONMENT_CLASSES: Object.values(ENVIRONMENT_CLASS) as [string, ...string[]],
  TIER_POLICIES: Object.values(TIER_POLICY) as [string, ...string[]],
  REGIONS: Object.values(ENVIRONMENT_REGION) as [string, ...string[]],
  ACCESS_MODES: Object.values(ACCESS_MODE) as [string, ...string[]],
};

/**
 * Create Environment DTO
 */
export class CreateEnvironmentDto {
  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_ENV_TYPE_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_ENV_TYPE_LENGTH)
  envType!: string;

  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_DISPLAY_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_DISPLAY_NAME_LENGTH)
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
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_ENV_TYPE_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_ENV_TYPE_LENGTH)
  envType?: string;

  @IsOptional()
  @IsString()
  @MinLength(ENVIRONMENT_CONSTANTS.MIN_DISPLAY_NAME_LENGTH)
  @MaxLength(ENVIRONMENT_CONSTANTS.MAX_DISPLAY_NAME_LENGTH)
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
  @IsIn(ENVIRONMENT_CONSTANTS.ACCESS_MODES)
  mode!: 'site_only' | 'api_key_enabled';
}
