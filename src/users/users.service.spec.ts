import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { User } from './schemas/user.schema';
import { RabbitMQService } from '../rabbit-mq.service';
import { UsersModule } from './users.module';
import { Model } from 'mongoose'; // or whatever library you're using for the User schema
import { getModelToken } from '@nestjs/mongoose';

export interface message {message:string}

const mockUserModel: Partial<Model<User>> = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

describe('UserServiceTest', () => {
  let controller: UserController;
  let userService: UserService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports:[HttpModule, UsersModule],
      providers: [
        UserService,
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
      ],
    }).compile();
 
    controller = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
    rabbitMQService = moduleRef.get<RabbitMQService>(RabbitMQService);
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
     
      const userId = 1;
      const user = {
        id:1, 
        email : "george.bluth@reqres.in", 
        first_name : "George", 
        last_name : "Bluth", 
        avatar : "https://reqres.in/img/faces/1-image.jpg"
      };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
      jest.spyOn(rabbitMQService, 'send').mockResolvedValue(undefined);

      // Act
      const result = await controller.getUserById(userId);

      // Assert 
      expect(userService.getUserById).toHaveBeenCalledWith(userId);
    
      expect(result).toBe(user);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const res = {} as message
      jest.spyOn(userService, 'createUser').mockResolvedValue(res);
      jest.spyOn(rabbitMQService, 'send').mockResolvedValue(undefined);

    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar', async () => {
      const res = {} as message
      jest.spyOn(userService, 'deleteAvatar').mockResolvedValue(res);
     

    });
  });

  describe('getAvatar', () => {
    it('should get avatar by id', async () => {
      const res = {} as message
      jest.spyOn(userService, 'getAvatar').mockResolvedValue(res);
      
      const userId = 1
      const result = await controller.getAvatar(userId);

      
      expect(userService.getAvatar).toHaveBeenCalledWith(userId);
      
      expect(result).toBe(res);

    });
  });



});
 