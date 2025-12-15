import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { PasswordUtility } from '../../utility/password/password.service';

@Injectable()
export class UserService {
  private passwordUtility = new PasswordUtility();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async addUser(userData: { username: string; name: string; password: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(userId: string, user: Partial<User>): Promise<User | null> {
    await this.userRepository.update(userId, user);
    return this.userRepository.findOneBy({ id: userId });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

}
