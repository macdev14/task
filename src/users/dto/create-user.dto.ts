export class CreateUserDto {
    userId?:number
    first_name: string;
    last_name: string;
    email: string;
    avatar?: Buffer;
    hash: string;


}
