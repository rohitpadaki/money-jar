import { Controller, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { UserCredentialsDto } from 'src/services/auth/dto/user-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Register A User"})
  @ApiCreatedResponse({description: "A user has been created"})
  @Post('register')
  async register(@Body() credentials: UserCredentialsDto) {
    const user = await this.authService.register(
      credentials.username, 
      credentials.name, 
      credentials.password);
    if (!user) return { message: 'User already exists' };
    return { message: 'Registered', user };
  }

  @ApiOperation({summary: "Login using Credentials"})
  @ApiResponse({description: "The User has successfully Logged in"})
  @Post('login')
  async login(@Body() credentials: UserCredentialsDto) {
    const result = await this.authService.login(credentials.username, credentials.password);
    if (!result) return { message: 'Invalid credentials' };
    return result;
  }
}