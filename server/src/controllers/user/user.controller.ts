import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import type { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';

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
}
