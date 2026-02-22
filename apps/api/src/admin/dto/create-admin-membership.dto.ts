import { ADMIN_LEVELS, type AdminLevel } from '@pytholit/contracts';
import { IsIn, IsString, IsUUID } from 'class-validator';

export class CreateAdminMembershipDto {
  @IsString()
  @IsUUID()
  userId!: string;

  @IsString()
  @IsIn(ADMIN_LEVELS as unknown as string[])
  level!: AdminLevel;
}
