import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { UserCredentialsDto } from 'src/services/auth/dto/user-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() credentials: UserCredentialsDto) {
    const user = this.authService.register(credentials.username, credentials.password);
    if (!user) return { message: 'User already exists' };
    return { message: 'Registered', user };
  }

  @Post('login')
  login(@Body() credentials: UserCredentialsDto) {
    const result = this.authService.login(credentials.username, credentials.password);
    if (!result) return { message: 'Invalid credentials' };
    return result;
  }
}