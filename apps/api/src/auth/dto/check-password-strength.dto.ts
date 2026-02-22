import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for password strength check endpoint.
 *
 * Accepts any non-empty password for analysis.
 * The actual strength requirements are enforced separately during signup.
 */
export class CheckPasswordStrengthDto {
  /** Password to analyze (1-128 characters) */
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
