// src/modules/transaction-summary/transaction-summary.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { TransactionSummaryService } from 'src/services/transaction-summary/transaction-summary.service';
import { TransactionSummaryController } from 'src/controllers/transaction-summary/transaction-summary.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule],
  providers: [TransactionSummaryService],
  controllers: [TransactionSummaryController],
})
export class TransactionSummaryModule {}
