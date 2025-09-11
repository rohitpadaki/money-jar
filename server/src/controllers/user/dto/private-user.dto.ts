// import { IsString, MinLength } from 'class-validator';
import { User } from 'src/models/user.entity';

export class PrivateUserDto {
//   @IsString()
  username: string;
  name: string;
  password: string;

  constructor(user: User) {
    this.username = user.username;
    this.name= user.name;
    this.password = user.password;
  }

}
