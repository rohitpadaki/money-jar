import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';

@Module({
  imports: [AuthModule, UserModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',    // change if your DB is running in Docker/remote
      port: 5432,
      username: 'postgres', // your postgres username
      password: 'root', // your postgres password
      database: 'moneyjar', // database name
      entities: [User],     // register your entity here
      autoLoadEntities: true, 
      synchronize: true,    // auto create tables (disable in production!)
    })],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService],
})
export class AppModule {}
