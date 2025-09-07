import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
    private usersList: User[] = [];

    getUsers() {
        return this.usersList;
    }

    addUser(newUser: User) {
        // Only prevent duplicate usernames
        const exists = this.usersList.some(user => user.username === newUser.username);
        if (exists) {
            return null;
        }
        this.usersList.push(newUser);
        return newUser;
    }

    updateUser(userId: number, user: User) {
        const existingUser = this.usersList.find(user => user.id === userId);
        if (existingUser) {
            existingUser.name = user.name;
            existingUser.username = user.username;
        }
    }

    deleteUser(userId: number) {
        this.usersList = this.usersList.filter(user => user.id !== userId);
    }

    findByUsername(username: string): User | undefined {
        return this.usersList.find(user => user.username === username);
    }


    validateUser(username: string, password: string): User | null {
        const user = this.findByUsername(username);
        if (user && (user as any).password === password) {
            return user;
        }
        return null;
    }
}
