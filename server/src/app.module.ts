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
import { ExpenseModule } from './modules/expense/expense.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ExpenseService } from './services/expense/expense.service';
import { ExpenseController } from './controllers/expense/expense.controller';
import { PaymentService } from './services/payment/payment.service';
import { PaymentController } from './controllers/payment/payment.controller';


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

      url: process.env.DATABASE_URL || undefined, // use Supabase URI if present
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,

      entities: [User, Transaction, Category, Group, GroupMember],
      autoLoadEntities: true,
      synchronize: true, // <-- this will auto-create tables
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    TransactionSummaryModule,
    GroupsModule,
    GroupMembersModule,
    ExpenseModule,
    PaymentModule,
  ],
  controllers: [AppController, UserController, AuthController, CategoryController, TransactionController, TransactionSummaryController, GroupsController, GroupMembersController, ExpenseController, PaymentController],
  providers: [AppService, CategoryService, TransactionService, TransactionSummaryService, GroupsService, GroupMembersService, ExpenseService, PaymentService],
})
export class AppModule {}
