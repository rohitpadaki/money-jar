import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth/auth.service';
import { UserCredentialsDto } from 'src/services/auth/dto/user-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({summary: "Register a new user"})
  @ApiResponse({
    status: 200,
    description: 'User is Registered',
    type: UserCredentialsDto,
    },
  )
  @ApiResponse({
    status: 401,
    description: 'User was already Registerd',
    schema: {
      example: {
        message: 'User already exists',
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid credentials',
      },
    },
  })  
  @Post('login')
  async login(@Body() credentials: UserCredentialsDto) {
    const result = await this.authService.login(credentials.username, credentials.password);
    if (!result) return { message: 'Invalid credentials' };
    return result;
  }
}