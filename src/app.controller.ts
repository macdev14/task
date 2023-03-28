import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQService } from './rabbit-mq.service';
import { message } from './users/users.service.spec';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly rabbitMQService: RabbitMQService,) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  async getHello() : Promise<message> {
    await this.rabbitMQService.send('rabbit-mq-producer', {
      message: this.appService.getHello(),
    });
    return { message: 'Message sent to the queue!'};
  }
}
