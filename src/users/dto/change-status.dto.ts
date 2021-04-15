import { IsString, IsNumber, IsNotEmpty, IS_IN, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly wechatId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsIn(['NEW', 'CONTACTED', 'SUCCESS', 'REFUSED'])
  readonly status: string;
}
