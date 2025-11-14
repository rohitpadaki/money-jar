import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from 'src/services/expense/expense.service';
import { CreateExpenseDto } from 'src/dto/create-expense.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // Create expense
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

  @Get(':expenseId')
  async getOne(@Param('expenseId') expenseId: string) {
    return this.expenseService.getExpenseById(expenseId);
  }

  @Delete(':expenseId')
  async delete(@Request() req: any, @Param('expenseId') expenseId: string) {
    return this.expenseService.deleteExpense({id: req.user.sub}, expenseId);
  }
}
