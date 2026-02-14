import { IsBoolean, IsEmail, IsOptional,IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  toEmail!: string;

  @IsString()
  @IsOptional()
  toName?: string;

  @IsString()
  subject!: string;

  @IsString()
  htmlBody!: string;

  @IsString()
  textBody!: string;

  @IsString()
  @IsOptional()
  fromEmail?: string;

  @IsString()
  @IsOptional()
  fromName?: string;

  @IsBoolean()
  @IsOptional()
  trackOpens?: boolean;

  @IsBoolean()
  @IsOptional()
  trackClicks?: boolean;
}
