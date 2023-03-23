import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { createWriteStream, unlink, writeFile } from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(private readonly httpService: HttpService,
    @InjectModel('User') private readonly userModel: Model<User>
    
  ) {}


  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    await this.userModel.create(createUserDto);
    const message = 'User created successfully!'
  }
  async deleteAvatar(userId: number) {
    let message:string;
    const userExists = await this.userModel.exists({userId : userId});
    if (userExists){
      const userObject = (await this.userModel.findOne({userId : userId}));
    
      unlink(`./${userObject.hash}.jpeg`, ()=>(console.log(`ImageFile deleted`)));
     
      userObject.deleteOne();
      message = "Successfully deleted!";
    }
    else{
      message = "UnSuccessfully deleted!";
    }
    
   
    return {message : message }
  
   
  }
  async getAvatar(userId: number): Promise<any> {

    const res = await axios.get(`https://reqres.in/api/users/${userId.toString()}`);
    const data = res.data.data
    const imageUrl = data.avatar;
    const userObject : CreateUserDto =  { 
      first_name: data.first_name, 
      last_name: data.last_name, 
      email: data.email, 
      hash: '',
      userId: userId
   }
    const response = await this.httpService.axiosRef({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
  });

   userObject.avatar = Buffer.from(response.data, 'binary');
   
    const base = userObject.avatar.toString('base64');
    userObject.hash = await bcrypt.hash(userObject.avatar, 2 );

    writeFile(`./${userObject.hash}.jpeg`, userObject.avatar,
      () => (console.log('stored in filesystem successfully')));
  

    const exists = await this.userModel.exists({ avatar: userObject.avatar });

    if (exists) {
        const avatarObject = await this.userModel.findOne({avatar: userObject.avatar }) ;
        const isMatch = await bcrypt.compare(userObject.avatar, avatarObject.hash);
        const requestResponse = (isMatch) ? (avatarObject.avatar.toString('base64')) : ('Hash does not match')
        return { 'response' : requestResponse};
     }     
     else{ 

      await this.userModel.create(
        userObject
      );
      return base;
     }

  }

 
  async getUserById(userId: number): Promise<any> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data.data;
  }

  

}
