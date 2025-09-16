// src/controllers/transaction-summary/transaction-summary.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { TransactionSummaryService } from 'src/services/transaction-summary/transaction-summary.service';

@Controller('transactions/summary')
@UseGuards(JwtAuthGuard)
export class TransactionSummaryController {
    constructor(private readonly summaryService: TransactionSummaryService) { }

    @Get('balance')
    async getBalance(@Request() req) {
        return this.summaryService.getTotalBalance(req.user.sub);
    }

    @Get('by-type')
    async getByType(@Request() req) {
        return this.summaryService.getTotalByType(req.user.sub);
    }

    @Get('by-category')
    async getByCategory(@Request() req) {
        return this.summaryService.getTotalByCategory(req.user.sub);
    }

    @Get('monthly')
    async getMonthly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getMonthlySummary(userId);
    }

    @Get('weekly')
    async getWeekly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getWeeklySummary(userId);
    }

    @Get('expenses-by-category')
    async getExpensesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getExpensesByCategory(userId);
    }

    @Get('incomes-by-category')
    async getIncomesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getIncomesByCategory(userId);
    }
}
