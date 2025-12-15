import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { PasswordUtility } from '../../utility/password/password.service';

@Injectable()
export class AuthService {
  private passwordUtility = new PasswordUtility();

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async register(username: string, name: string, password: string) {
    const existing = await this.userService.findByUsername(username);
    if (existing) return null;

    const hashedPassword = await this.passwordUtility.hash(password);
    return this.userService.addUser({ username, name, password: hashedPassword });
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isPasswordValid = await this.passwordUtility.compare(password, user.password);
    if (!isPasswordValid) return null;

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}