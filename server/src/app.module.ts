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
import { TransactionService } from './services/transaction/transaction.service';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionSummaryService } from './services/transaction-summary/transaction-summary.service';
import { TransactionSummaryController } from './controllers/transaction-summary/transaction-summary.controller';
import { TransactionSummaryModule } from './modules/transaction-summary/transaction-summary.module';
import { Group } from './models/group.entity';
import { GroupMember } from './models/group-member.entity';
import { GroupsService } from './services/group/group.service';
import { GroupsController } from './controllers/group/group.controller';
import { GroupsModule } from './modules/group/group.module';
import { GroupMembersModule } from './modules/group-member/group-member.module';
import { GroupMembersService } from './services/group-member/group-member.service';
import { GroupMembersController } from './controllers/group-member/group-member.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
    }),
    AuthModule,
    UserModule, 
    CategoryModule,
    TransactionModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,    // change if your DB is running in Docker/remote
      port: parseInt(String(process.env.DB_PORT)),
      username: process.env.DB_USERNAME, // your postgres username
      password: process.env.DB_PASSWORD, // your postgres password
      database: process.env.DB_NAME, // database name
      entities: [User, Transaction, Category, Group, GroupMember],     // register your entity here
      autoLoadEntities: true, 
      synchronize: true,    // auto create tables (disable in production!)
    }),
    TransactionSummaryModule,
    GroupsModule,
    GroupMembersModule,
  ],
  controllers: [AppController, UserController, AuthController, CategoryController, TransactionController, TransactionSummaryController, GroupsController, GroupMembersController],
  providers: [AppService, CategoryService, TransactionService, TransactionSummaryService, GroupsService, GroupMembersService],
})
export class AppModule {}
