import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import type { User } from 'src/models/user.entity';
import { UserService } from 'src/services/user/user.service';
import { PublicUserDto } from './dto/public-user.dto';
import { PrivateUserDto } from './dto/private-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    // @Get()
    // async getUsers(){
    //     return await this.userService.getUsers();
    // }

    // @Post()
    // async addUser(@Body() user: PrivateUserDto){
    //     return await this.userService.addUser(user);
    // }

    // @Put(":id")
    // async updateUser(@Param("id") userId: string, @Body() user: PrivateUserDto){
    //     return await this.userService.updateUser(userId, user);
    // }

    // @Delete(":id")
    // async deleteUser(@Param("id") userId){
    //     return await this.userService.deleteUser(userId);
    // }

    // @Get(":username")
    // async findUser(@Param("username") username:string){
    //     let user = await this.userService.findByUsername(username);
    //     if(!user) throw new NotFoundException('User does not exist');

    //     return new PublicUserDto(user);
    // }
}
