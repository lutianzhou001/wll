import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly wechatId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  createDate: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly inviter: string;
}
