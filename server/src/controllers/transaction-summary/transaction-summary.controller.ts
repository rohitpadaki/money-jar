// src/controllers/transaction-summary/transaction-summary.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { TransactionSummaryService } from 'src/services/transaction-summary/transaction-summary.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction Summary')
@ApiBearerAuth()
@Controller('transactions/summary')
@UseGuards(JwtAuthGuard)
export class TransactionSummaryController {
    constructor(private readonly summaryService: TransactionSummaryService) { }

    @Get('balance')
    @ApiOperation({ summary: 'Get total balance for the current user' })
    @ApiOkResponse({
        description: 'Net balance (income - expenses)',
        schema: {
          example: {
            balance: 1250.75,
          },
        },
      })      
    async getBalance(@Request() req) {
        return this.summaryService.getTotalBalance(req.user.sub);
    }

    @Get('by-type')
    @ApiOperation({ summary: 'Get total by transaction type for the current user' })
    @ApiOkResponse({
        description: 'Total grouped by type (income/expense)',
        schema: {
          example: [
            { type: 'INCOME', total: 3000 },
            { type: 'EXPENSE', total: 1750.25 },
          ],
        },
      })      
    async getByType(@Request() req) {
        return this.summaryService.getTotalByType(req.user.sub);
    }

    @Get('by-category')
    @ApiOperation({ summary: 'Get total by category for the current user' })
    @ApiOkResponse({
        description: 'Total transaction amount grouped by category',
        schema: {
          example: [
            { category: 'Food', total: 450.75 },
            { category: 'Transport', total: 120.00 },
            { category: 'Uncategorized', total: 80.00 },
          ],
        },
      })      
    async getByCategory(@Request() req) {
        return this.summaryService.getTotalByCategory(req.user.sub);
    }

    @Get('monthly')
    @ApiOperation({ summary: 'Get monthly summary for the current user' })
    @ApiOkResponse({
        description: 'Monthly totals of income and expenses',
        schema: {
          example: [
            { month: 'October 2025', totalIncome: 2000, totalExpense: 1250 },
            { month: 'November 2025', totalIncome: 1800, totalExpense: 950 },
          ],
        },
      })      
    async getMonthly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getMonthlySummary(userId);
    }

    @Get('weekly')
    @ApiOperation({ summary: 'Get weekly summary for the current user' })
    @ApiOkResponse({
        description: 'Weekly totals of income and expenses',
        schema: {
          example: [
            { week: '2025-45', totalIncome: 500, totalExpense: 300 },
            { week: '2025-46', totalIncome: 600, totalExpense: 400 },
          ],
        },
      })      
    async getWeekly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getWeeklySummary(userId);
    }

    @Get('expenses-by-category')
    @ApiOperation({ summary: 'Get expenses by category for the current user' })
    @ApiOkResponse({
        description: 'Total expenses grouped by category',
        schema: {
          example: [
            { category: 'Food', totalExpense: 320.50 },
            { category: 'Travel', totalExpense: 150.00 },
            { category: 'Uncategorized', totalExpense: 45.00 },
          ],
        },
      })      
    async getExpensesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getExpensesByCategory(userId);
    }

    @Get('incomes-by-category')
    @ApiOperation({ summary: 'Get incomes by category for the current user' })
    @ApiOkResponse({
        description: 'Total incomes grouped by category',
        schema: {
          example: [
            { category: 'Salary', totalIncome: 2500 },
            { category: 'Freelance', totalIncome: 600 },
          ],
        },
      })      
    async getIncomesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getIncomesByCategory(userId);
    }
}
