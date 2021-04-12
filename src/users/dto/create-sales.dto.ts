import {
  IsIn,
  IsString,
  IsNumber,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string;
}
