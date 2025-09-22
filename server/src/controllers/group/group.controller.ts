import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { GroupsService } from 'src/services/group/group.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(@Body('name') name: string, @Req() req) {
    // req.user comes from JwtStrategy validate() return
    return this.groupsService.createGroup(Number(req.user.sub), name);
  }
}
