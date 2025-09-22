import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { GroupsService } from 'src/services/group/group.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { CreateGroupDto } from './dto/createGroupDto.dto';


@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post()
    async createGroup(@Body() CreateGroupDto: CreateGroupDto, @Req() req) {
        // req.user comes from JwtStrategy validate() return
        return this.groupsService.createGroup(Number(req.user.sub), CreateGroupDto.name);
    }

    @Get('my')
    async myGroups(@Req() req) {
        return this.groupsService.getUserGroups(Number(req.user.sub));
    }

    @Get(':groupId')
    async getGroup(@Param('groupId') groupId: string) {
        return this.groupsService.getGroupDetails(groupId);
    }

}
