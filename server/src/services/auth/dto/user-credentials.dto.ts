import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UserCredentialsDto {
  @IsString()
  @ApiProperty({description: "Username which is Unique", example: "WinnieThePooh"})
  username: string;

  @IsString()
  @ApiProperty({description: "name of the User", example: "Pooh"})
  name: string;

  @IsString()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password must be at most 16 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({description: "Password (will be hashed later on)"})
  password: string;
}
