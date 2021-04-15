import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interfaces';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { CreateSalesDto } from './dto/create-sales.dto';
import * as bcrypt from 'bcryptjs';
import { UserDto } from './dto/user.dto';
import { JWTService } from './jwt.service';
import { ChangeStatusDto } from './dto/change-status.dto';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JWTService,
  ) {}
  async customerCreate(newCustomer: CreateCustomerDto) {
    const createdCustomer = new this.userModel(newCustomer);
    const userRegistered = await this.findByWechatId(newCustomer.wechatId);
    if (!userRegistered) {
      createdCustomer.role = 'CUSTOMER';
      createdCustomer.status = 'NEW';
      return await createdCustomer.save();
    } else {
      throw new HttpException('DUPLICATED USER', HttpStatus.FORBIDDEN);
    }
  }

  async salesCreate(newSales: CreateSalesDto) {
    const createdSales = new this.userModel(newSales);
    const salesRegistered = await this.findByEmail(newSales.email);
    if (!salesRegistered) {
      createdSales.role = 'SALES';
      createdSales.status = 'IN_USE';
      createdSales.password = await bcrypt.hash(newSales.password, saltRounds);
      return await createdSales.save();
    } else {
      throw new HttpException('DUPLICATED SALES', HttpStatus.FORBIDDEN);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByWechatId(wechatId: string): Promise<User> {
    return await this.userModel.findOne({ wechatId }).exec();
  }

  async queryCustomer(queryCustomerDto: QueryCustomerDto) {
    const thisMonth = await this.getThisMonth();
    if (queryCustomerDto.isThisMonth === false) {
      return await this.userModel
        .find()
        .skip(queryCustomerDto.offset)
        .limit(queryCustomerDto.limit)
        .exec();
    } else {
      const query: any = {
        $and: [
          {
            createDate: {
              $gte: thisMonth[0],
              $lte: thisMonth[1],
            },
          },
          { role: 'CUSTOMER' },
        ],
      };
      return await this.userModel
        .find(query)
        .sort('-createDate')
        .skip(queryCustomerDto.offset)
        .limit(queryCustomerDto.limit)
        .exec();
    }
  }

  async getThisMonth() {
    const data = new Date();
    const year = data.getFullYear();
    data.setDate(1);
    data.setHours(0);
    data.setSeconds(0);
    data.setMinutes(0);

    const data1 = new Date();
    if (data.getMonth() == 11) {
      data1.setMonth(0);
      data1.setFullYear(year + 1);
    } else {
      data1.setMonth(data.getMonth() + 1);
    }
    data1.setDate(1);
    data1.setHours(0);
    data1.setSeconds(0);
    data1.setMinutes(0);
    const timeStart = parseInt(String(data.getTime() / 1000));
    const timeEnd = parseInt(String(data1.getTime() / 1000)) - 1;
    return [timeStart, timeEnd];
  }

  async validateSalesLogin(email, password) {
    const userFromDb = await this.userModel.findOne({ email });
    if (!userFromDb || userFromDb.role != 'SALES')
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    const isValidPass = await bcrypt.compare(password, userFromDb.password);
    if (isValidPass) {
      const accessToken = await this.jwtService.createToken(
        email,
        userFromDb.role,
      );
      return { token: accessToken, user: new UserDto(userFromDb) };
    } else {
      throw new HttpException(
        'LOGIN.PASSWORD_NOT_VALID',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async changeStatus(statusChangeDto: ChangeStatusDto) {
    const userFromDb = await this.userModel.findOne({
      wechatId: statusChangeDto.wechatId,
    });
    if (!userFromDb || userFromDb.role != 'CUSTOMER') {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    userFromDb.status = statusChangeDto.status;
    await userFromDb.save();
    return userFromDb;
  }

  async contactCustomer(statusChangeDto: ChangeStatusDto) {
    const userFromDb = await this.userModel.findOne({
      wechatId: statusChangeDto.wechatId,
    });
    if (!userFromDb || userFromDb.role != 'CUSTOMER') {
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (
      statusChangeDto.status == 'SUCCESS' ||
      statusChangeDto.status == 'REFUSED'
    ) {
      throw new HttpException('CHANGE_STATUS_FAILED', HttpStatus.FORBIDDEN);
    }
    userFromDb.status = statusChangeDto.status;
    await userFromDb.save();
    return userFromDb;
  }
}
