import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected() {
    return { message: 'You are authenticated!' };
  }
}
