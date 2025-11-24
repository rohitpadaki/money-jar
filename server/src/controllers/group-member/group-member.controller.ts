import { Controller, Post, Delete, Get, Param, Req, Body, UseGuards } from '@nestjs/common';
import { GroupMembersService } from 'src/services/group-member/group-member.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { AddMemberDto } from './dto/addMemberDto.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Group Members')
@ApiBearerAuth()
@Controller('group-members')
@UseGuards(JwtAuthGuard)
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @ApiOperation({ summary: 'Add a member to a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiCreatedResponse({
    description: 'Member successfully added',
    schema: {
      example: {
        id: 'member_123',
        group: { id: 'group_1', name: 'Trip to NYC' },
        user: { id: 'user_2', username: 'Bob' },
        joinedAt: '2025-11-19T12:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group or user not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })
  @ApiForbiddenResponse({
    description: 'Only group creator can add members',
    schema: {
      example: { statusCode: 403, message: 'Only the group creator can add members', error: 'Forbidden' },
    },
  })  
  @Post(':groupId/add')
  addMember(@Param('groupId') groupId: string, @Body() addMemberDto: AddMemberDto, @Req() req) {
    return this.groupMembersService.addMember(groupId, addMemberDto.userId, req.user.sub);
  }

  @ApiOperation({ summary: 'Remove a member from a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to remove' })
  @ApiOkResponse({
    description: 'Member successfully removed',
    schema: {
      example: { message: 'Member removed' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })
  @ApiForbiddenResponse({
    description: 'Only group creator can remove members',
    schema: {
      example: { statusCode: 403, message: 'Only the group creator can remove members', error: 'Forbidden' },
    },
  })  
  @Delete(':groupId/remove/:userId')
  removeMember(@Param('groupId') groupId: string, @Param('userId') userId: string, @Req() req) {
    return this.groupMembersService.removeMember(groupId, userId, req.user.sub);
  }

  @ApiOperation({ summary: 'List members of a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiOkResponse({
    description: 'List of group members',
    schema: {
      example: [
        { id: 'user_1', username: 'Alice', joinedAt: '2025-11-01T10:00:00.000Z' },
        { id: 'user_2', username: 'Bob', joinedAt: '2025-11-02T14:30:00.000Z' },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })  
  @Get(':groupId')
  listMembers(@Param('groupId') groupId: string) {
    return this.groupMembersService.listMembers(groupId);
  }

  @ApiOperation({ summary: 'Leave a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiOkResponse({
    description: 'User successfully left the group',
    schema: {
      example: { message: 'You have left the group' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Group creator cannot leave',
    schema: {
      example: { statusCode: 400, message: 'Group creator cannot leave the group', error: 'Bad Request' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found or user not a member',
    schema: {
      example: { statusCode: 404, message: 'You are not a member of this group', error: 'Not Found' },
    },
  })  
  @Delete(':groupId/leave')
  leaveGroup(@Param('groupId') groupId: string, @Req() req) {
    return this.groupMembersService.leaveGroup(groupId, req.user.sub);
  }
}
