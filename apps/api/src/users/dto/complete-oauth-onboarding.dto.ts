import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CompleteOAuthOnboardingDto {
  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_USERNAME_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_USERNAME_LENGTH)
  @Matches(AUTH_CONSTANTS.USERNAME_REGEX, {
    message:
      'Username must be 3-39 chars, letters/numbers/hyphens only, and cannot start/end with hyphen',
  })
  username!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(AUTH_CONSTANTS.MAX_NAME_LENGTH)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(AUTH_CONSTANTS.MAX_NAME_LENGTH)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
