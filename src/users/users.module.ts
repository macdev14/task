import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQModule } from 'src/rabbit-mq.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: '127.0.0.1', //host smtp
        secure: false, 
        port: 1025,
        ignoreTLS: true,
      },
      defaults: { 
        from: '"',
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/taskapi'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule,
    HttpModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UsersModule {}
