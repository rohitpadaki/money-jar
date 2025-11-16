import { Controller, Post, Delete, Get, Param, Req, Body, UseGuards } from '@nestjs/common';
import { GroupMembersService } from 'src/services/group-member/group-member.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AddMemberDto } from './dto/addMemberDto.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Group Members')
@ApiBearerAuth()
@Controller('group-members')
@UseGuards(JwtAuthGuard)
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post(':groupId/add')
  @ApiOperation({ summary: 'Add a member to a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  addMember(@Param('groupId') groupId: string, @Body() addMemberDto: AddMemberDto, @Req() req) {
    return this.groupMembersService.addMember(groupId, addMemberDto.userId, req.user.sub);
  }

  @Delete(':groupId/remove/:userId')
  @ApiOperation({ summary: 'Remove a member from a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to remove' })
  removeMember(@Param('groupId') groupId: string, @Param('userId') userId: string, @Req() req) {
    return this.groupMembersService.removeMember(groupId, userId, req.user.sub);
  }

  @Get(':groupId')
  @ApiOperation({ summary: 'List members of a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  listMembers(@Param('groupId') groupId: string) {
    return this.groupMembersService.listMembers(groupId);
  }

  @Delete(':groupId/leave')
  @ApiOperation({ summary: 'Leave a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  leaveGroup(@Param('groupId') groupId: string, @Req() req) {
    return this.groupMembersService.leaveGroup(groupId, req.user.sub);
  }
}
