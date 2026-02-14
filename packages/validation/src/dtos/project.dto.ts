import { IsString, IsBoolean, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PROJECT_CONSTANTS } from '../schemas/project.schema';

/**
 * Create Project DTO
 */
export class CreateProjectDto {
  @IsString()
  @MinLength(PROJECT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_NAME_LENGTH)
  name!: string;

  @IsString()
  @IsOptional()
  @MinLength(PROJECT_CONSTANTS.MIN_SLUG_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_SLUG_LENGTH)
  @Matches(PROJECT_CONSTANTS.SLUG_REGEX, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsBoolean()
  @IsOptional()
  repoExportEnabled?: boolean;
}

/**
 * Update Project DTO
 */
export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(PROJECT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_NAME_LENGTH)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(PROJECT_CONSTANTS.MIN_SLUG_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_SLUG_LENGTH)
  @Matches(PROJECT_CONSTANTS.SLUG_REGEX, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsBoolean()
  @IsOptional()
  repoExportEnabled?: boolean;
}
