import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    const user = this.authService.register(body.username, body.password);
    if (!user) return { message: 'User already exists' };
    return { message: 'Registered', user };
  }

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    const result = this.authService.login(body.username, body.password);
    if (!result) return { message: 'Invalid credentials' };
    return result;
  }
}