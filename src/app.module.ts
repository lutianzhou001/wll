import { HttpModule, HttpService, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { default as config } from './config';

const userString =
  config.db.user && config.db.pass
    ? config.db.user + ':' + config.db.pass + '@'
    : '';
const authSource = config.db.authSource
  ? '?authSource=' + config.db.authSource + '&w=1'
  : '';

@Module({
  // tslint:disable-next-line: max-line-length
  imports: [
    MongooseModule.forRoot(
      'mongodb://' +
        userString +
        config.db.host +
        ':' +
        (config.db.port || '27017') +
        '/' +
        config.db.database +
        authSource,
    ),
    UsersModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
