import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQService } from './rabbit-mq.service';
import { message } from './users/users.service.spec';





describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: RabbitMQService,
          useValue: {
            send: jest.fn()
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const hello = await appController.getHello();
      const message = {message:'Message sent to the queue!'} as message
      expect(hello).toStrictEqual(message);
    });
  });
});
 

