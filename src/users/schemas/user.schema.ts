import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Document } from 'mongoose';
// inside the class definition
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop()
  userId : number
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  
  avatar?: Buffer;
  
  @Prop()
  hash?: string 
}

export const UserSchema = SchemaFactory.createForClass(User);
