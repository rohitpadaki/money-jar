// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  register(username: string, password: string) {
    const newUser: User = {
      id: Date.now(), // simple id
      name: username, // just use username as name for now
      username,
      password,
    };

    const created = this.userService.addUser(newUser);
    if (!created) return null;
    return created;
  }

  login(username: string, password: string) {
    const user = this.userService.validateUser(username, password);
    if (!user) return null;

    const payload = { username: user.username };
    return {
      token: this.jwtService.sign(payload),
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
