import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { default as config } from './config';
import { map } from 'rxjs/operators';
import * as child from 'child_process';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // async writeFile(decodedImage) {
  //   fs.writeFile('qrcode.jpg', decodedImage, function (err) {});
  // }

  async queryAccessToken() {
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
      return getAccessTokenRes.access_token;
    } else {
      throw new Error('GET_ACCESSTOKEN_ERROR');
    }
  }

  async getQRCode(scene: string) {
    try {
      const act = await this.queryAccessToken();
      const curl =
        'curl --output qrcode.jpg https://api.weixin.qq.com/wxa/getwxacodeunlimit\\?access_token\\=' +
        act +
        ' -d \'{"scene": "' +
        scene +
        '"}\'';
      await child.exec(curl, function (err, stdout, stderr) {
        if (err) {
          // TODO
          // throw new Error('SAVING_PICTURE_ERROR');
        }
      });
      const bitmap = fs.readFileSync('qrcode.jpg');
      // convert binary data to base64 encoded string
      const b = Buffer.from(bitmap).toString('base64');
      return b;
    } catch (e) {
      throw new Error('CANNOT_FIND_FILE');
    }
  }
}
