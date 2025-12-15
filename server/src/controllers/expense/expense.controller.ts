import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from 'src/services/expense/expense.service';
import { CreateExpenseDto } from 'src/dto/create-expense.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Create a new expense' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiCreatedResponse({
    description: 'Expense successfully created',
    schema: {
      example: {
        id: 'exp_123',
        amount: '42.00',
        note: 'Dinner',
        splitType: 'ALL',
        payer: { id: 'user_1', name: 'Alice' },
        participants: [
          { user: { id: 'user_2', name: 'Bob' }, share: '21.00' },
          { user: { id: 'user_3', name: 'Charlie' }, share: '21.00' },
        ],
        group: { id: 'group_1', name: 'Trip to NYC' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or participant mismatch',
    schema: {
      example: { statusCode: 400, message: 'participants required for SELECTED split', error: 'Bad Request' },
    },
  })
  @ApiForbiddenResponse({
    description: 'User is not a group member',
    schema: {
      example: { statusCode: 403, message: 'Only group members can create expenses', error: 'Forbidden' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group or payer not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Request() req: any,
    @Param('groupId') groupId: string,
    @Body() dto: CreateExpenseDto,
  ) {
    // req.user must exist (auth middleware)
    return this.expenseService.createExpense({id: req.user.sub}, groupId, dto);
  }

  @ApiOperation({ summary: 'List expenses for a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiOkResponse({
    description: 'List of expenses',
    schema: {
      example: [
        {
          id: 'exp_123',
          amount: '42.00',
          note: 'Dinner',
          splitType: 'ALL',
          payer: { id: 'user_1', name: 'Alice' },
          participants: [
            { user: { id: 'user_2', name: 'Bob' }, share: '21.00' },
            { user: { id: 'user_3', name: 'Charlie' }, share: '21.00' },
          ],
        },
        {
          id: 'exp_124',
          amount: '18.00',
          note: 'Taxi',
          splitType: 'SELECTED',
          payer: { id: 'user_2', name: 'Bob' },
          participants: [
            { user: { id: 'user_2', name: 'Bob' }, share: '9.00' },
            { user: { id: 'user_3', name: 'Charlie' }, share: '9.00' },
          ],
        },
      ],
    },
  })  
  @Get()
  async list(
    @Param('groupId') groupId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const l = limit ? Number(limit) : 50;
    const o = offset ? Number(offset) : 0;
    return this.expenseService.listExpenses(groupId, l, o);
  }

  @ApiOperation({ summary: 'Get a single expense by ID' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiParam({ name: 'expenseId', description: 'The ID of the expense' })
  @ApiOkResponse({
    description: 'Expense details',
    schema: {
      example: {
        id: 'exp_123',
        amount: '42.00',
        note: 'Dinner',
        splitType: 'ALL',
        payer: { id: 'user_1', name: 'Alice' },
        participants: [
          { user: { id: 'user_2', name: 'Bob' }, share: '21.00' },
          { user: { id: 'user_3', name: 'Charlie' }, share: '21.00' },
        ],
        group: { id: 'group_1', name: 'Trip to NYC' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Expense not found',
    schema: {
      example: { statusCode: 404, message: 'Expense not found', error: 'Not Found' },
    },
  })  
  @Get(':expenseId')
  async getOne(@Param('expenseId') expenseId: string) {
    return this.expenseService.getExpenseById(expenseId);
  }

  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'expenseId', description: 'The ID of the expense' })
  @ApiOkResponse({
    description: 'Expense successfully deleted',
    schema: {
      example: { success: true },
    },
  })
  @ApiForbiddenResponse({
    description: 'Only payer can delete the expense',
    schema: {
      example: { statusCode: 403, message: 'Only payer can delete the expense', error: 'Forbidden' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Expense not found',
    schema: {
      example: { statusCode: 404, message: 'Expense not found', error: 'Not Found' },
    },
  })  
  @Delete(':expenseId')
  async delete(@Request() req: any, @Param('expenseId') expenseId: string) {
    return this.expenseService.deleteExpense({id: req.user.sub}, expenseId);
  }
}
