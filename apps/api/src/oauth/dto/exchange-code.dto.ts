import { IsHexadecimal, IsString, Length } from 'class-validator';

export class ExchangeCodeDto {
  @IsString()
  @IsHexadecimal({ message: 'Code must be hex' })
  @Length(64, 64, { message: 'Code must be 64 characters' })
  code!: string;
}
