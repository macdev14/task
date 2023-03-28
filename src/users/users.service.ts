import { Body, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { createWriteStream, existsSync, unlink, writeFile, writeFileSync, open } from 'fs';
import * as bcrypt from 'bcrypt';
import { userResp } from './user';

@Injectable()
export class UserService {
  // Use HttpService and userModel
  constructor(private readonly httpService: HttpService,
    @InjectModel('User') private readonly userModel: Model<User>
    
  ) {}


  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string; }> {
    await this.userModel.create(createUserDto);
    const message = 'User created successfully!'
    return {message: message }
  }



  async deleteAvatar(userId: number) : Promise<{ message: string; }>{
    let message:string;
    const userExists = await this.userModel.exists({userId : userId});
    if (userExists){
      const userObject = (await this.userModel.findOne({userId : userId}));
      const imgName = `./images/${userObject.hash}.jpeg`;
     
      unlink(imgName, ()=>(console.log(`ImageFile deleted`)));
      
     
      userObject.deleteOne();
      message = "Successfully deleted!";
    }
    else{
      message = "UnSuccessfully deleted!";
    }
    
   
    return {message : message }
  
   
  }
  async getAvatar(userId: number): Promise<{message:string}> {

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
    const imgName = `./images/${userObject.hash}.jpeg`;

    
    
   
     
  

    const exists = await this.userModel.exists({ avatar: userObject.avatar });

    if (exists) {
        const avatarObject = await this.userModel.findOne({avatar: userObject.avatar }) ;
        const isMatch = await bcrypt.compare(userObject.avatar, avatarObject.hash);
        const requestResponse = (isMatch) ? (avatarObject.avatar.toString('base64')) : ('Hash does not match')
        writeFile(imgName, userObject.avatar, ()=>(console.log('Trying to create image...')))
        return { message : requestResponse};
     }     
     else{ 
      writeFile(imgName, userObject.avatar, ()=>(console.log('Trying to create image...')))
      await this.userModel.create(
        userObject
      );
      return {message : base};
     }

  }

 
  


  async getUserById(userId: number): Promise<userResp> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);

    return response.data.data;
  }

  

}


