// import { IsString, MinLength } from 'class-validator';

export class UserCredentialsDto {
//   @IsString()
  username: string;

//   @IsString()
//   @MinLength(4)
  password: string;
}
