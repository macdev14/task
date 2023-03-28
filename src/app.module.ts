import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RabbitMQModule } from './rabbit-mq.module';





@Module({
  imports: [
   
    UsersModule,
    RabbitMQModule,
   

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

