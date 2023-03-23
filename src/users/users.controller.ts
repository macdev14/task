import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { RabbitMQService } from 'src/rabbit-mq.service';
import { MailerService } from '@nestjs-modules/mailer';


@Controller('api/users')
export class UserController {
  constructor(
    private mailerService: MailerService,
    private readonly userService: UserService, private readonly rabbitMQService: RabbitMQService) {}


  @Post()
  async createUser(@Body() createUserDto: CreateUserDto ): Promise<string> {
    this.rabbitMQService.send('rabbit-mq-producer', {
      message: await this.userService.createUser(createUserDto).catch(err=>(err)),
    }).catch(e=>console.log(e));
    const message =  'Message sent to the rabbitmq and email!';
    
    await this.mailerService.sendMail({
      to: createUserDto[0].email,
      from: 'test@email.com',
      subject: 'Payever Email',
      html: `<h3 style="color: red">${message}</h3>`,
    });
    return message;
    
    
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  @Get(':userId/avatar')
  async getAvatar(@Param('userId') userId: number): Promise<User> {
    return await this.userService.getAvatar(userId);
  }

  @Delete(':userId/avatar')
  async deleteAvatar(@Param('userId') userId: number): Promise<any> {
    return await this.userService.deleteAvatar(userId);
  }

  
}
