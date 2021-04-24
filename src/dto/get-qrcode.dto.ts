import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetQrcodeDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}
