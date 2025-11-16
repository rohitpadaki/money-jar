import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { GroupsService } from 'src/services/group/group.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/createGroupDto.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new group' })
    async createGroup(@Body() CreateGroupDto: CreateGroupDto, @Req() req) {
        // req.user comes from JwtStrategy validate() return
        return this.groupsService.createGroup(req.user.sub, CreateGroupDto.name);
    }

    @Get('my')
    @ApiOperation({ summary: 'Get groups for the current user' })
    async myGroups(@Req() req) {
        return this.groupsService.getUserGroups(req.user.sub);
    }

    @Get(':groupId')
    @ApiOperation({ summary: 'Get group details by ID' })
    @ApiParam({ name: 'groupId', description: 'The ID of the group' })
    async getGroup(@Param('groupId') groupId: string) {
        return this.groupsService.getGroupDetails(groupId);
    }

}
