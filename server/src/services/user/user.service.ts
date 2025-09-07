import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
    private usersList : User[] = [];

    getUsers(){
        return this.usersList;
    }

    addUser(newUser : User){
        this.usersList.push(newUser);
    }

    updateUser(userId: number, user: User){
        const existingUser = this.usersList.find(user => user.id === userId);
        if (existingUser) {
            existingUser.name = user.name;
            existingUser.username = user.username;
        }
    }

    deleteUser(userId: number){
        this.usersList = this.usersList.filter(user => user.id !== userId);
    }


}
