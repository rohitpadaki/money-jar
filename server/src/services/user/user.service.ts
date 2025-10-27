import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    async getUsers(): Promise<User[]> {
        return this.userRepo.find();
    }

    async addUser(newUser: Partial<User>): Promise<User> {
        const user = this.userRepo.create(newUser); // creates entity instance
        return this.userRepo.save(user);            // inserts into DB

    }

    async updateUser(userId: string, user: Partial<User>): Promise<User | null> {
        await this.userRepo.update(userId, user);
        return this.userRepo.findOneBy({ id: userId });
    }

    async deleteUser(userId: string): Promise<void> {
        await this.userRepo.delete(userId);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOneBy({ username });
    }


    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: { username } });

        if (user && user.password === password) {
            return user;
        }

        return null;
    }

}
