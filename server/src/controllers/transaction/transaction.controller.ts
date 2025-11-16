// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from '../../services/transaction/transaction.service';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { Transaction } from '../../models/transaction.entity';
import { CreateTransactionDto } from '../../services/transaction/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'src/services/transaction/dto/update-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the current user' })
  async findAll(@Request() req): Promise<Transaction[]> {
    return this.transactionService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single transaction by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  async findOne(@Param('id') id: string, @Request() req): Promise<Transaction> {
    return this.transactionService.findOneByUser(id, req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(@Request() req, @Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(req.user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.transactionService.remove(id, req.user.sub);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateTransactionDto) {
    return await this.transactionService.updateTransaction(id, req.user.sub, dto);
  }
}
