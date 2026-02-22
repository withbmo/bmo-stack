import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsEmail, IsIn, IsString, Length, Matches,MaxLength } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @IsIn(['email_verification'])
  purpose!: 'email_verification';

  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code!: string;
}
