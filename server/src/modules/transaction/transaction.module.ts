// src/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../models/transaction.entity';
import { TransactionService } from '../../services/transaction/transaction.service';
import { TransactionController } from '../../controllers/transaction/transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TypeOrmModule.forFeature([Transaction])]
})
export class TransactionModule {}
