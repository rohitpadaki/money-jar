import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { randomBytes } from 'crypto';  // Node's crypto lib

@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: randomBytes(32).toString('hex'), // 32 random bytes -> hex string
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
