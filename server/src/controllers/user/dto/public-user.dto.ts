// import { IsString, MinLength } from 'class-validator';
import { User } from 'src/models/user.entity';

export class PublicUserDto {
//   @IsString()
  username: string;
  name: string;

  constructor(user: User) {
    this.username = user.username;
    this.name= user.name;
  }

}
