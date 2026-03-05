import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CompleteOAuthOnboardingDto {
  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_USERNAME_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_USERNAME_LENGTH)
  @Matches(AUTH_CONSTANTS.USERNAME_REGEX)
  username!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
