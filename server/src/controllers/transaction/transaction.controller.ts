// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from '../../services/transaction/transaction.service';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { Transaction } from '../../models/transaction.entity';
import { CreateTransactionDto } from '../../services/transaction/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'src/services/transaction/dto/update-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async findAll(@Request() req): Promise<Transaction[]> {
    return this.transactionService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Transaction> {
    return this.transactionService.findOneByUser(id, req.user.sub);
  }

  @Post()
  async create(@Request() req, @Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(req.user.sub, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.transactionService.remove(id, req.user.sub);
  }

  @Put(":id")
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateTransactionDto) {
    return await this.transactionService.updateTransaction(id, req.user.sub, dto);
  }
}
