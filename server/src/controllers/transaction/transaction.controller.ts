// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Put, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from '../../services/transaction/transaction.service';
import { JwtAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { Transaction } from '../../models/transaction.entity';
import { CreateTransactionDto } from '../../services/transaction/dto/create-transaction.dto';
import { UpdateTransactionDto } from 'src/services/transaction/dto/update-transaction.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Get all transactions for the current user' })
  @ApiOkResponse({
    description: 'List of transactions',
    schema: {
      example: [
        {
          id: 'txn_001',
          amount: 45.00,
          type: 'EXPENSE',
          note: 'Groceries',
          date: '2025-11-19T12:00:00.000Z',
          category: { id: 'cat_1', name: 'Food' },
          user: { id: 'user_1', username: 'Alice' },
        },
        {
          id: 'txn_002',
          amount: 120.00,
          type: 'INCOME',
          note: 'Salary',
          date: '2025-11-18T09:30:00.000Z',
          category: { id: 'cat_2', name: 'Work' },
          user: { id: 'user_1', username: 'Alice' },
        },
      ],
    },
  })  
  @Get()
  async findAll(@Request() req): Promise<Transaction[]> {
    return this.transactionService.findAllByUser(req.user.sub);
  }

  @ApiOperation({ summary: 'Get a single transaction by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  @ApiOkResponse({
    description: 'Transaction details',
    schema: {
      example: {
        id: 'txn_001',
        amount: 45.00,
        type: 'EXPENSE',
        note: 'Groceries',
        date: '2025-11-19T12:00:00.000Z',
        category: { id: 'cat_1', name: 'Food' },
        user: { id: 'user_1', username: 'Alice' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
    schema: {
      example: { statusCode: 404, message: 'Transaction not found', error: 'Not Found' },
    },
  })  
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Transaction> {
    return this.transactionService.findOneByUser(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiCreatedResponse({
    description: 'Transaction successfully created',
    schema: {
      example: {
        id: 'txn_003',
        amount: 75.00,
        type: 'EXPENSE',
        note: 'Dinner',
        date: '2025-11-19T18:45:00.000Z',
        category: { id: 'cat_1', name: 'Food' },
        user: { id: 'user_1', username: 'Alice' },
      },
    },
  })  
  @Post()
  async create(@Request() req, @Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  @ApiOkResponse({
    description: 'Transaction successfully deleted',
    schema: {
      example: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
    schema: {
      example: { statusCode: 404, message: 'Transaction not found', error: 'Not Found' },
    },
  })  
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.transactionService.remove(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'The ID of the transaction' })
  @ApiOkResponse({
    description: 'Transaction successfully updated',
    schema: {
      example: {
        id: 'txn_001',
        amount: 50.00,
        type: 'EXPENSE',
        note: 'Updated groceries',
        date: '2025-11-19T12:00:00.000Z',
        category: { id: 'cat_1', name: 'Food' },
        user: { id: 'user_1', username: 'Alice' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
    schema: {
      example: { statusCode: 404, message: 'Transaction not found', error: 'Not Found' },
    },
  })  
  @Put(":id")
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateTransactionDto) {
    return await this.transactionService.updateTransaction(id, req.user.sub, dto);
  }
}
