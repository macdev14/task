import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';

import { MailerModule } from '@nestjs-modules/mailer';
import { RabbitMQModule } from '../rabbit-mq.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host:  process.env.SMTP_HOST ??'127.0.0.1', //host smtp
        secure: process.env.SMTP_SECURE ?? false, 
        port: process.env.SMTP_PORT ?? 1025,
        ignoreTLS: process.env.SMTP_IGNORE_TLS ?? true,
      },
      defaults: { 
        from: '"',
      },
    }),
    MongooseModule.forRoot(`mongodb://${ process.env.MONGODB_HOST ?? '127.0.0.1' }:${ process.env.MONGODB_PORT ?? 27017 }/${process.env.MONGODB_DB ?? 'taskapi'}`),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule,
    HttpModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UsersModule {}
