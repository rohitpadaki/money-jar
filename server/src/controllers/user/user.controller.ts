import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import type { User } from 'src/models/user.entity';
import { UserService } from 'src/services/user/user.service';
import { PublicUserDto } from './dto/public-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get()
    getUsers(){
        return this.userService.getUsers();
    }

    @Post()
    addUser(@Body() user: User){
        return this.userService.addUser(user);
    }

    @Put(":id")
    updateUser(@Param("id") userId: number, @Body() user){
        return this.userService.updateUser(userId, user);
    }

    @Delete(":id")
    deleteUser(@Param("id") userId){
        return this.userService.deleteUser(userId);
    }

    @Get(":username")
    async findUser(@Param("username") username:string){
        let user = await this.userService.findByUsername(username);
        if(!user) return { message: 'User does not exist' };

        return new PublicUserDto(user);
    }
}
