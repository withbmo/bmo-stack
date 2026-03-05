import { AUTH_CONSTANTS } from '@pytholit/validation';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(AUTH_CONSTANTS.MAX_USERNAME_LENGTH)
  @Matches(AUTH_CONSTANTS.USERNAME_REGEX)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
