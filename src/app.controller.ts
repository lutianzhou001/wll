import { Body, Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { IResponse } from './common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from './common/dto/response.dto';
import { GetQrcodeDto } from './dto/get-qrcode.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private  readonly usersService:UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/version')
  version(): string {
    return '1.1.0';
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/qrcode')
  @ApiOperation({ description: '获取二维码' })
  async getQRCode(@Body() getQRCodeDto: GetQrcodeDto): Promise<IResponse> {
    try {
      const res = await this.usersService.findByEmail(getQRCodeDto.email);
      if (res) {
        const response = await this.appService.getQRCode(res._id);
        return new ResponseSuccess('GET_QRCODE_SUCCESSFUL', response);
      } else {
        return new ResponseError('FIND_SALES_ERROR');
      }
    } catch (e) {
      return new ResponseError('GET_QRCODE_ERROR', e);
    }
  }
}
