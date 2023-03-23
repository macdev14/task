import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserSchema } from './users/schemas/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { RabbitMQModule } from './rabbit-mq.module';


@Module({
  imports: [
   
    UsersModule,
    RabbitMQModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
