import { IsString, MaxLength, MinLength } from 'class-validator';

/** DTO for the password-strength check endpoint. */
export class CheckPasswordStrengthDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
