import { Controller, Post, Delete, Get, Param, Req, Body, UseGuards } from '@nestjs/common';
import { GroupMembersService } from 'src/services/group-member/group-member.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AddMemberDto } from './dto/addMemberDto.dto';

@Controller('group-members')
@UseGuards(JwtAuthGuard)
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post(':groupId/add')
  addMember(@Param('groupId') groupId: string, @Body() addMemberDto: AddMemberDto, @Req() req) {
    return this.groupMembersService.addMember(groupId, addMemberDto.userId, Number(req.user.sub));
  }

  @Delete(':groupId/remove/:userId')
  removeMember(@Param('groupId') groupId: string, @Param('userId') userId: number, @Req() req) {
    return this.groupMembersService.removeMember(groupId, userId, Number(req.user.sub));
  }

  @Get(':groupId')
  listMembers(@Param('groupId') groupId: string) {
    return this.groupMembersService.listMembers(groupId);
  }

  @Delete(':groupId/leave')
  leaveGroup(@Param('groupId') groupId: string, @Req() req) {
    return this.groupMembersService.leaveGroup(groupId, Number(req.user.sub));
  }
}
