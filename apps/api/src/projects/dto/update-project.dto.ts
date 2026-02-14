import { IsString, IsBoolean, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PROJECT_CONSTANTS } from '@pytholit/validation/zod';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(PROJECT_CONSTANTS.MIN_NAME_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_NAME_LENGTH)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(PROJECT_CONSTANTS.MIN_SLUG_LENGTH)
  @MaxLength(PROJECT_CONSTANTS.MAX_SLUG_LENGTH)
  @Matches(PROJECT_CONSTANTS.SLUG_REGEX, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsBoolean()
  repoExportEnabled?: boolean;
}
