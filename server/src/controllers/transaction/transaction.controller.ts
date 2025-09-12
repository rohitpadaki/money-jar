// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async findAll(): Promise<Transaction[]> {
    return await this.transactionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction | null> {
    let transaction = await this.transactionService.findOne(+id);
    if (!transaction) throw new NotFoundException("Transaction not found");

    return transaction;
  }

  @Post()
  async create(@Body() transaction: Partial<Transaction>): Promise<Transaction> {
    return await this.transactionService.create(transaction);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.transactionService.remove(+id);
  }
}
