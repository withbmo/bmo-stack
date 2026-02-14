import { IsEmail, IsIn, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6, { message: 'OTP code must be 6 digits' })
  code!: string;

  @IsString()
  @IsIn(['email_verification', 'password_reset', '2fa', 'login_verification'])
  purpose!: 'email_verification' | 'password_reset' | '2fa' | 'login_verification';
}
