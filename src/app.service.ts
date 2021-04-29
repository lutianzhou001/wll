import { Injectable, HttpService } from '@nestjs/common';
import { default as config } from './config';
import { map } from 'rxjs/operators';
import { ResponseError } from './common/dto/response.dto';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // async writeFile(decodedImage) {
  //   fs.writeFile('qrcode.jpg', decodedImage, function (err) {});
  // }

  async getQRCode(scene: string) {
    // first get the access-code
    const getAccessTokenUrl =
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      config.app.appId +
      '&secret=' +
      config.app.appSecret;
    const getAccessTokenRes = await this.httpService
      .post(getAccessTokenUrl)
      .pipe(map((response) => response.data))
      .toPromise();
    if (getAccessTokenRes.access_token) {
      const getQRCodeUrl =
        'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' +
        getAccessTokenRes.access_token;
      const original_data = await this.httpService
        .post(getQRCodeUrl, {
          scene: scene,
        })
        .pipe(map((response) => response.data))
        .toPromise();
      const b = Buffer.from(original_data);
      return b.toString('base64');
    } else {
      return new ResponseError(
        'REQUEST_QRCODE_ERROR',
        getAccessTokenRes.errcode,
      );
    }
  }
}
