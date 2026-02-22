import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTerminalSessionDto {
  @IsString()
  @MinLength(1)
  tabId!: string;
}

export class UpdateTerminalTabDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsBoolean()
  tmuxEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AppendTerminalTranscriptDto {
  @IsString()
  @MinLength(1)
  @MaxLength(8192)
  delta!: string;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  seq!: number;
}

