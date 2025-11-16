// import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/models/user.entity';

export class PublicUserDto {
//   @IsString()
  @ApiProperty({description: "Username"})
  username: string;

  @ApiProperty({description: "Name"})
  name: string;

  constructor(user: User) {
    this.username = user.username;
    this.name= user.name;
  }

}
