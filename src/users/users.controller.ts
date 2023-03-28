import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { MailerService } from '@nestjs-modules/mailer';
import { RabbitMQService } from '../rabbit-mq.service';
import { userResp } from './user';
import { message } from './users.service.spec';







@Controller('api')
export class UserController {
  constructor(
    private mailerService: MailerService,
    private readonly userService: UserService, private readonly rabbitMQService: RabbitMQService) {}


  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto ): Promise<message> {
    this.rabbitMQService.send('rabbit-mq-producer', {
      message: await this.userService.createUser(createUserDto).then((res)=>(res.message)).catch(err=>(err)),
    }).catch(e => console.log(e));
    const message =  'Message sent to the rabbitmq and email!';
    
    await this.mailerService.sendMail({
      to: createUserDto[0].email,
      from: 'test@email.com',
      subject: 'Payever Email',
      html: `<h3 style="color: red">${message}</h3>`,
    });
    return {message: message};
    
    
  }

  @Get('/user/:userId')
  async getUserById(@Param('userId') userId: number): Promise<userResp> {
    const res = await this.userService.getUserById(userId);
    return res;
  }

  @Get('/user/:userId/avatar')
  async getAvatar(@Param('userId') userId: number): Promise<message> {
    return await this.userService.getAvatar(userId);
  }

  @Delete('/user/:userId/avatar')
  async deleteAvatar(@Param('userId') userId: number): Promise<message> {
    return await this.userService.deleteAvatar(userId);
  }

  
}
