import {
  IsString,
  IsNumber, IsNotEmpty, IsBoolean
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class QueryCustomerDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly limit: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly offset: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly isThisMonth: boolean;
}
