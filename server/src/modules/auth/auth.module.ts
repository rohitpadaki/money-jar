import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { randomBytes } from 'crypto';  // Node's crypto lib
import { UserModule } from 'src/modules/user/user.module';
import { User } from 'src/models/user.entity';

@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: randomBytes(32).toString('hex'), // 32 random bytes -> hex string
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
