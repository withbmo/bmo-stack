import { IsEmail, IsString, MaxLength, MinLength, Matches, IsOptional } from 'class-validator';
import { AUTH_CONSTANTS } from '../schemas/auth.schema';
import { IsStrongPassword } from '../validators/password-strength.validator';

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
  @IsStrongPassword(3, {
    message: 'Password is not strong enough. Use a mix of uncommon words, avoid patterns, and make it longer.',
  })
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
  @IsStrongPassword(3, {
    message: 'Password is not strong enough. Use a mix of uncommon words, avoid patterns, and make it longer.',
  })
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
