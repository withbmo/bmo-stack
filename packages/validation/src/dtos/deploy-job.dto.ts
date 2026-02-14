import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Deploy source DTO
 */
export class DeploySourceDto {
  @IsString()
  origin!: string;

  @IsString()
  ref!: string;
}

/**
 * Create Deploy Job DTO
 */
export class CreateDeployJobDto {
  @IsString()
  projectId!: string;

  @IsString()
  environmentId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeploySourceDto)
  source?: DeploySourceDto;
}
