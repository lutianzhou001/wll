import { Controller, Injectable, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation } from '@nestjs/swagger';
import { User } from './interfaces/user.interfaces';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { CreateSalesDto } from './dto/create-sales.dto';
import { Login } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/roles.adminguard';
import { SalesGuard } from '../common/guards/roles.salesguard';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Post('sales/create')
  @ApiOperation({ description: '创建一个销售人员' })
  async createSales(
    @Body() createSalesDto: CreateSalesDto,
  ): Promise<IResponse> {
    try {
      const newSales = await this.usersService.salesCreate(createSalesDto);
    } catch (e) {
      return new ResponseError('CREATE_SALES_ERROR', e);
    }
  }

  @Post('sales/login')
  @ApiOperation({ description: '销售人员登陆' })
  async salesLogin(@Body() login: Login): Promise<IResponse> {
    try {
      const response = await this.usersService.validateSalesLogin(
        login.email,
        login.password,
      );
      return new ResponseSuccess('SALES_LOGIN_SUCCESS', response);
    } catch (e) {
      return new ResponseError('SALES_LOGIN_ERROR', e);
    }
  }

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
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(SalesGuard)
  @ApiOperation({ description: '查询我的客户' })
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

  @Post('status/change')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  @ApiOperation({ description: '管理员修改客户状态' })
  async statusChange(
    @Body() statusChangeDto: ChangeStatusDto,
  ): Promise<IResponse> {
    try {
      const changedStatus = await this.usersService.changeStatus(
        statusChangeDto,
      );
      return new ResponseSuccess('STATUS_CHANGE_SUCCESS', changedStatus);
    } catch (e) {
      return new ResponseError('STATUS_CHANGE_FAILED', e);
    }
  }

  @Post('customer/contact')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(SalesGuard)
  @ApiOperation({ description: '销售修改客户状态' })
  async contactCustomer(
    @Body() statusChangeDto: ChangeStatusDto,
  ): Promise<IResponse> {
    try {
      const changedStatus = await this.usersService.contactCustomer(
        statusChangeDto,
      );
      return new ResponseSuccess('STATUS_CHANGE_SUCCESS', changedStatus);
    } catch (e) {
      return new ResponseError('STATUS_CHANGE_FAILED', e);
    }
  }
}
