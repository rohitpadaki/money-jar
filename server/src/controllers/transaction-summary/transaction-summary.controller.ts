// src/controllers/transaction-summary/transaction-summary.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { TransactionSummaryService } from 'src/services/transaction-summary/transaction-summary.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction Summary')
@ApiBearerAuth()
@Controller('transactions/summary')
@UseGuards(JwtAuthGuard)
export class TransactionSummaryController {
    constructor(private readonly summaryService: TransactionSummaryService) { }

    @Get('balance')
    @ApiOperation({ summary: 'Get total balance for the current user' })
    async getBalance(@Request() req) {
        return this.summaryService.getTotalBalance(req.user.sub);
    }

    @Get('by-type')
    @ApiOperation({ summary: 'Get total by transaction type for the current user' })
    async getByType(@Request() req) {
        return this.summaryService.getTotalByType(req.user.sub);
    }

    @Get('by-category')
    @ApiOperation({ summary: 'Get total by category for the current user' })
    async getByCategory(@Request() req) {
        return this.summaryService.getTotalByCategory(req.user.sub);
    }

    @Get('monthly')
    @ApiOperation({ summary: 'Get monthly summary for the current user' })
    async getMonthly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getMonthlySummary(userId);
    }

    @Get('weekly')
    @ApiOperation({ summary: 'Get weekly summary for the current user' })
    async getWeekly(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getWeeklySummary(userId);
    }

    @Get('expenses-by-category')
    @ApiOperation({ summary: 'Get expenses by category for the current user' })
    async getExpensesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getExpensesByCategory(userId);
    }

    @Get('incomes-by-category')
    @ApiOperation({ summary: 'Get incomes by category for the current user' })
    async getIncomesByCategory(@Request() req) {
        const userId = req.user.sub;
        return this.summaryService.getIncomesByCategory(userId);
    }
}
