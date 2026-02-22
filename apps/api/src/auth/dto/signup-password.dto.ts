import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupPasswordDto {
  @IsEmail()
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_USERNAME_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_USERNAME_LENGTH)
  @Matches(AUTH_CONSTANTS.USERNAME_REGEX)
  username!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(AUTH_CONSTANTS.MAX_NAME_LENGTH)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(AUTH_CONSTANTS.MAX_NAME_LENGTH)
  lastName?: string;

  @IsString()
  captchaToken!: string;
}
