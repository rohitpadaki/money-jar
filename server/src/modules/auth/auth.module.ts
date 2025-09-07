import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';


@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: 'myS3cr3tK3y!_2025_random_value_@#$', // move to .env in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
