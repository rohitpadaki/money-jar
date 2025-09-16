// src/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../models/transaction.entity';
import { TransactionService } from '../../services/transaction/transaction.service';
import { TransactionController } from '../../controllers/transaction/transaction.controller';
import { AuthModule } from '../../modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TypeOrmModule.forFeature([Transaction])]
})
export class TransactionModule {}
