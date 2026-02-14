import { IsEmail, IsString, MaxLength, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { AUTH_CONSTANTS } from '../schemas/auth.schema';

/**
 * Login DTO
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  password!: string;

  @IsString()
  captchaToken!: string;
}

/**
 * Signup DTO
 */
export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_USERNAME_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_USERNAME_LENGTH)
  @Matches(AUTH_CONSTANTS.USERNAME_REGEX, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(AUTH_CONSTANTS.MAX_FULLNAME_LENGTH)
  fullName!: string;

  @IsString()
  captchaToken!: string;
}

/**
 * OTP Purpose enum
 */
export enum OTPPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  TWO_FA = '2fa',
  LOGIN_VERIFICATION = 'login_verification',
}

/**
 * Send OTP DTO
 */
export class SendOtpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsEnum(OTPPurpose)
  purpose!: OTPPurpose;

  @IsString()
  @IsOptional()
  captchaToken?: string;
}

/**
 * Verify OTP DTO
 */
export class VerifyOtpDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/, { message: 'OTP code must be 6 digits' })
  code!: string;

  @IsEnum(OTPPurpose)
  purpose!: OTPPurpose;
}

/**
 * Forgot Password DTO
 */
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(AUTH_CONSTANTS.MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  captchaToken!: string;
}

/**
 * Reset Password DTO
 */
export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  newPassword!: string;
}

/**
 * Change Password DTO
 */
export class ChangePasswordDto {
  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  currentPassword!: string;

  @IsString()
  @MinLength(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  @MaxLength(AUTH_CONSTANTS.MAX_PASSWORD_LENGTH)
  newPassword!: string;
}
