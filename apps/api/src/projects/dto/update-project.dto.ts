import { PROJECT_CONSTANTS } from '@pytholit/validation/zod';
import { IsBoolean, IsOptional, IsString, Matches,MaxLength, MinLength } from 'class-validator';

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
