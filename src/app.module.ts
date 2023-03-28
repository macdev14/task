import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RabbitMQModule } from './rabbit-mq.module';
import { ConfigModule } from '@nestjs/config';




@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    RabbitMQModule,
   

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

