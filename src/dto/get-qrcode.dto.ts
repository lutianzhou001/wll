import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetQrcodeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly scene: string;
}
