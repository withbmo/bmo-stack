import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class DeploySourceDto {
  @IsString()
  origin!: string;

  @IsString()
  ref!: string;
}

export class CreateDeployJobDto {
  @IsString()
  projectId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeploySourceDto)
  source?: DeploySourceDto;
}
