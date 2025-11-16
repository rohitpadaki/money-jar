import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from 'src/services/expense/expense.service';
import { CreateExpenseDto } from 'src/dto/create-expense.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Create a new expense' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
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
  @Get(':expenseId')
  async getOne(@Param('expenseId') expenseId: string) {
    return this.expenseService.getExpenseById(expenseId);
  }

  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiParam({ name: 'expenseId', description: 'The ID of the expense' })
  @Delete(':expenseId')
  async delete(@Request() req: any, @Param('expenseId') expenseId: string) {
    return this.expenseService.deleteExpense({id: req.user.sub}, expenseId);
  }
}
