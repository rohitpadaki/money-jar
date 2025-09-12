// src/services/transaction/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../models/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async findAllByUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: { user: { id: userId } },
      relations: ['category', 'user'],
      order: { date: 'DESC' },
    });
  }

  async findOneByUser(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'user'],
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async create(userId: number, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      amount: dto.amount,
      type: dto.type,
      note: dto.note,
      user: { id: userId } as any,
      category: dto.categoryId ? { id: dto.categoryId } as any : undefined,
    });
    return this.transactionRepo.save(transaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.findOneByUser(id, userId);
    await this.transactionRepo.remove(transaction);
  }
}
