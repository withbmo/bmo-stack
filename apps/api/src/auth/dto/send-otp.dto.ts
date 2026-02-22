import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsEmail, IsIn, IsString, MaxLength } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @IsIn(['email_verification'])
  purpose!: 'email_verification';

  @IsString()
  captchaToken!: string;
}
