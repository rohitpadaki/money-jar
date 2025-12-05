import { Controller, Post, Body, Req, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { GroupsService } from 'src/services/group/group.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/createGroupDto.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @ApiOperation({ summary: 'Create a new group' })
    @ApiCreatedResponse({
        description: 'Group successfully created',
        schema: {
          example: {
            id: 'group_123',
            name: 'Trip to NYC',
            createdBy: { id: 'user_1', username: 'Alice' },
            createdAt: '2025-11-19T12:00:00.000Z',
          },
        },
      })
      @ApiNotFoundResponse({
        description: 'User not found',
        schema: {
          example: { statusCode: 404, message: 'User not found', error: 'Not Found' },
        },
      })      
    @Post()
    async createGroup(@Body() CreateGroupDto: CreateGroupDto, @Req() req) {
        // req.user comes from JwtStrategy validate() return
        return this.groupsService.createGroup(req.user.sub, CreateGroupDto.name);
    }

    @ApiOperation({ summary: 'Get groups for the current user' })
    @ApiOkResponse({
        description: 'List of groups the user belongs to',
        schema: {
          example: [
            {
              id: 'group_123',
              name: 'Trip to NYC',
              createdBy: { id: 'user_1', username: 'Alice' },
              memberCount: 3,
            },
            {
              id: 'group_456',
              name: 'Weekend Hike',
              createdBy: { id: 'user_2', username: 'Bob' },
              memberCount: 5,
            },
          ],
        },
      })      
    @Get('my')
    async myGroups(@Req() req) {
        return this.groupsService.getUserGroups(req.user.sub);
    }

    @ApiOperation({ summary: 'Get group details by ID' })
    @ApiParam({ name: 'groupId', description: 'The ID of the group' })
    @ApiOkResponse({
        description: 'Group details',
        schema: {
          example: {
            id: 'group_123',
            name: 'Trip to NYC',
            createdBy: { id: 'user_1', username: 'Alice' },
            members: [
              { id: 'user_1', username: 'Alice', joinedAt: '2025-11-01T10:00:00.000Z' },
              { id: 'user_2', username: 'Bob', joinedAt: '2025-11-02T14:30:00.000Z' },
            ],
            createdAt: '2025-11-01T09:00:00.000Z',
          },
        },
      })
      @ApiNotFoundResponse({
        description: 'Group not found',
        schema: {
          example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
        },
      })      
    @Get(':groupId')
    async getGroup(@Param('groupId') groupId: string) {
        return this.groupsService.getGroupDetails(groupId);
    }

    @ApiOperation({ summary: 'Delete a group' })
    @ApiParam({ name: 'groupId', description: 'The ID of the group' })
    @ApiOkResponse({
        description: 'Group successfully deleted',
        schema: {
          example: { message: 'Group deleted successfully' },
        },
      })
      @ApiNotFoundResponse({
        description: 'Group not found',
        schema: {
          example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
        },
      })
      @ApiForbiddenResponse({
        description: 'Only group creator can delete the group',
        schema: {
          example: { statusCode: 403, message: 'Only the group creator can delete the group', error: 'Forbidden' },
        },
      })
    @Delete(':groupId')
    async deleteGroup(@Param('groupId') groupId: string, @Req() req) {
        return this.groupsService.deleteGroup(groupId, req.user.sub);
    }

}
