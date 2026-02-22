import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsOptional()
  @IsString()
  redirectTo?: string;
}
