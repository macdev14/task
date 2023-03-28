import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { UsersModule } from './users.module';
import { UserController } from './users.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { RabbitMQModule } from '../../src/rabbit-mq.module';
import { User, UserSchema } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RabbitMQService } from '../../src/rabbit-mq.service';
import { CreateUserDto } from './dto/create-user.dto';
import { message } from './users.service.spec';
import { userResp } from './user';
import { ConfigModule } from '@nestjs/config';

const mockUserModel: Partial<Model<User>> = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};
describe('UsersController test', () => {
  let controller: UserController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        UsersModule,
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
      MongooseModule.forRoot(`mongodb://${ process.env.MONGODB_HOST ?? 'localhost' }:${ process.env.MONGODB_PORT ?? 27017 }/${process.env.MONGODB_DB ?? 'taskapi'}`),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      RabbitMQModule,
      HttpModule],
      providers:
       [ UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: RabbitMQService,
          useValue: {
            send: jest.fn()
          },
        },
      ]
      
      ,
    }).compile();


    controller = moduleRef.get<UserController>(UserController);
    
    
  });

  describe('createUser controller test', () => {
    it('should create a user', async () => {
      const object: CreateUserDto = {
        
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
     
      }
      const res = {} as message | Promise<message>
      jest.spyOn(controller, 'createUser').mockResolvedValue(res);
      const create = await controller.createUser(object);
      expect(create).toBe(res);

    });
  });

  describe('get User By Id', () => {
    it('should get user by id', async () => {
      const res = {} as Promise<userResp> ;
      jest.spyOn(controller, 'getUserById').mockResolvedValue(res);
      const userByID = await controller.getUserById(1);
      expect(userByID).toBe(res);
  

    });
  });

  describe('get User Avatar By Id', () => {
    it('should get user by id', async () => {
      const res = {} as message | Promise<message> ;
      jest.spyOn(controller, 'getAvatar').mockResolvedValue(res);
      const userByID = await controller.getAvatar(1);
      expect(userByID).toBe(res);
  

    });
  });

  describe('delete User Avatar By Id', () => {
    it('should get user by id', async () => {
      const res = {} as message | Promise<message> ;
      jest.spyOn(controller, 'deleteAvatar').mockResolvedValue(res);
      const deleteUserByID = await controller.deleteAvatar(1);
      expect(deleteUserByID).toBe(res);
  

    });
  });

  
});
