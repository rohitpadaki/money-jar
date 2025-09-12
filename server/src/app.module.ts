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
import * as dotenv from 'dotenv';
import { Transaction } from './models/transaction.entity';
import { Category } from './models/category.entity';
import { CategoryController } from './controllers/category/category.controller';
import { CategoryService } from './services/category/category.service';
dotenv.config();
import { CategoryModule } from './modules/category/category.module';


@Module({
  imports: [AuthModule, UserModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,    // change if your DB is running in Docker/remote
      port: parseInt(String(process.env.DB_PORT)),
      username: process.env.DB_USERNAME, // your postgres username
      password: process.env.DB_PASSWORD, // your postgres password
      database: process.env.DB_NAME, // database name
      entities: [User, Transaction, Category],     // register your entity here
      autoLoadEntities: true, 
      synchronize: true,    // auto create tables (disable in production!)
    }),
    CategoryModule
  ],
  controllers: [AppController, UserController, AuthController, CategoryController],
  providers: [AppService, CategoryService],
})
export class AppModule {}
