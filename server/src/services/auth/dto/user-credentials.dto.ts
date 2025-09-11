// import { IsString, MinLength } from 'class-validator';

export class UserCredentialsDto {
//   @IsString()
  username: string;

  name: string;

//   @IsString()
//   @MinLength(4)
  password: string;
}
