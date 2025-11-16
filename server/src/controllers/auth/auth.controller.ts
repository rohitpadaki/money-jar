import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { UserCredentialsDto } from 'src/services/auth/dto/user-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Register a new user"})
  @Post('register')
  async register(@Body() credentials: UserCredentialsDto) {
    const user = await this.authService.register(
      credentials.username, 
      credentials.name, 
      credentials.password);
    if (!user) return { message: 'User already exists' };
    return { message: 'Registered', user };
  }

  @ApiOperation({summary: "Login with username and password"})
  @Post('login')
  async login(@Body() credentials: UserCredentialsDto) {
    const result = await this.authService.login(credentials.username, credentials.password);
    if (!result) return { message: 'Invalid credentials' };
    return result;
  }
}