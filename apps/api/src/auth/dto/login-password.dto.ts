import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginPasswordDto {
  @IsEmail()
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  password!: string;

  @IsString()
  captchaToken!: string;
}
