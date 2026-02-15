import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const ROLES = ['user', 'admin', 'support', 'billing'] as const;

export class UpdateAdminUserDto {
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isSuperuser?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(ROLES as unknown as string[])
  role?: (typeof ROLES)[number];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  permissions?: string[];
}

