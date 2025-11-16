// import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/user.entity';

export class PrivateUserDto {
//   @IsString()
  @ApiProperty({description: "Username"})
  username: string;
  @ApiProperty({description: "Name of the Person"})
  name: string;
  @ApiProperty({description: "Password"})
  password: string;

  constructor(user: User) {
    this.username = user.username;
    this.name= user.name;
    this.password = user.password;
  }

}
