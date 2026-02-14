import { IsEmail, IsIn,IsOptional, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(['email_verification', 'password_reset', '2fa', 'login_verification'])
  purpose!: 'email_verification' | 'password_reset' | '2fa' | 'login_verification';

  @IsOptional()
  @IsString()
  captchaToken?: string;
}
