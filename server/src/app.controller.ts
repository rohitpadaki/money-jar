import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({description: "Authentication Test"})
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected() {
    return { message: 'You are authenticated!' };
  }
}
