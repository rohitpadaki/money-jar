import { Body, Controller, UseGuards, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import type { User } from 'src/models/user.entity';
import { UserService } from 'src/services/user/user.service';
import { PublicUserDto } from './dto/public-user.dto';
import { PrivateUserDto } from './dto/private-user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    async getUsers(){
        return await this.userService.getUsers();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    async addUser(@Body() user: PrivateUserDto){
        return await this.userService.addUser(user);
    }

    @Put(":id")
    @ApiOperation({ summary: 'Update a user' })
    @ApiParam({ name: 'id', description: 'The ID of the user' })
    async updateUser(@Param("id") userId: string, @Body() user: PrivateUserDto){
        return await this.userService.updateUser(userId, user);
    }

    @Delete(":id")
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', description: 'The ID of the user' })
    async deleteUser(@Param("id") userId){
        return await this.userService.deleteUser(userId);
    }

    @Get(":username")
    @ApiOperation({ summary: 'Find a user by username' })
    @ApiParam({ name: 'username', description: 'The username of the user' })
    async findUser(@Param("username") username:string){
        let user = await this.userService.findByUsername(username);
        if(!user) throw new NotFoundException('User does not exist');

        return new PublicUserDto(user);
    }
}
