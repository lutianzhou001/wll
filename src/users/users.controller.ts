import { Controller, Injectable, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation } from '@nestjs/swagger';
import { User } from './interfaces/user.interfaces';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Post('customer/create')
  @ApiOperation({ description: '创建一个客户' })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<IResponse> {
    try {
      const newCustomer = await this.usersService.customerCreate(
        createCustomerDto,
      );
      return new ResponseSuccess('CREATE_CUSTOMER_SUCCESS', newCustomer);
    } catch (e) {
      return new ResponseError('CREATE_CUSTOMER_ERROR', e);
    }
  }

  @Post('customer/query')
  async queryCustomer(
    @Body() queryCustomerDto: QueryCustomerDto,
  ): Promise<IResponse> {
    try {
      const customers = await this.usersService.queryCustomer(queryCustomerDto);
      return new ResponseSuccess('QUERY_SUCCEED', customers);
    } catch (e) {
      return new ResponseError('QUERY_FAILED', e);
    }
  }
}
