// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async register(username: string, name:string, password: string) {
    const existing = await this.userService.findByUsername(username);
    if (existing) return null;

    return this.userService.addUser({ username, name, password });
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || user.password !== password) return null;

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
