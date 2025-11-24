// import { IsString, MinLength } from 'class-validator';

import { ApiProperty } from "@nestjs/swagger";

export class UserCredentialsDto {
//   @IsString()
  @ApiProperty({description: "Username which is Unique", example: "WinnieThePooh"})
  username: string;

  @ApiProperty({description: "name of the User", example: "Pooh"})
  name: string;

//   @IsString()
//   @MinLength(4)
  @ApiProperty({description: "Password (will be hashed later on)"})
  password: string;
}
