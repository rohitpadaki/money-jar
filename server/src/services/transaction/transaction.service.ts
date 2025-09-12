// src/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../models/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepo.find({ relations: ['category', 'user'] });
  }

  async findOne(id: number): Promise<Transaction | null> {
    return await this.transactionRepo.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction = await this.transactionRepo.create(transaction);
    return await this.transactionRepo.save(newTransaction);
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepo.delete(id);
  }
}
