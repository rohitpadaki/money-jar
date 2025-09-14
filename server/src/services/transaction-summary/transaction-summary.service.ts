// src/services/transaction-summary/transaction-summary.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';

@Injectable()
export class TransactionSummaryService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
    ) { }

    async getTotalBalance(userId: number) {
        const { total } = await this.transactionRepo
            .createQueryBuilder('transaction')
            .select('SUM(CASE WHEN transaction.type = :income THEN transaction.amount ELSE -transaction.amount END)', 'total')
            .where('transaction.userId = :userId', { userId, income: 'income' })
            .getRawOne();

        return { balance: total || 0 };
    }

    async getTotalByType(userId: number) {
        return this.transactionRepo
            .createQueryBuilder('transaction')
            .select('transaction.type', 'type')
            .addSelect('SUM(transaction.amount)', 'total')
            .where('transaction.userId = :userId', { userId })
            .groupBy('transaction.type')
            .getRawMany();
    }

    async getTotalByCategory(userId: number) {
        return this.transactionRepo
            .createQueryBuilder('transaction')
            .leftJoin('transaction.category', 'category')
            .select('category.name', 'category')
            .addSelect('SUM(transaction.amount)', 'total')
            .where('transaction.userId = :userId', { userId })
            .groupBy('category.name')
            .getRawMany();
    }

    async getMonthlySummary(userId: number) {
        console.log('Debug: userId passed to summary query ->', userId);
        const rows = await this.transactionRepo
            .createQueryBuilder('t')
            .select("TO_CHAR(DATE_TRUNC('month', t.date), 'FMMonth YYYY')", 'month') // FM trims spaces
            .addSelect(
                `SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END)`,
                'total_income',
            )
            .addSelect(
                `SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)`,
                'total_expense',
            )
            .where('t.userId = :userId', {
                userId,
                income: TransactionType.INCOME,
                expense: TransactionType.EXPENSE,
            })
            .groupBy("DATE_TRUNC('month', t.date)")
            .orderBy("DATE_TRUNC('month', t.date)", 'ASC')
            .getRawMany();

        return rows.map(r => ({
            month: (r.month as string).trim(),
            totalIncome: Number(r.total_income) || 0,
            totalExpense: Number(r.total_expense) || 0,
        }));
    }


    async getWeeklySummary(userId: number) {
        const rows = await this.transactionRepo
            .createQueryBuilder('t')
            // IYYY-IW gives ISO year-week like "2025-37"
            .select("TO_CHAR(DATE_TRUNC('week', t.date), 'IYYY-IW')", 'week')
            .addSelect(
                `SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END)`,
                'total_income',
            )
            .addSelect(
                `SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END)`,
                'total_expense',
            )
            .where('t.userId = :userId', {
                userId,
                income: TransactionType.INCOME,
                expense: TransactionType.EXPENSE,
            })
            .groupBy("DATE_TRUNC('week', t.date)")
            .orderBy("DATE_TRUNC('week', t.date)", 'ASC')
            .getRawMany();

        return rows.map(r => ({
            week: r.week,
            totalIncome: Number(r.total_income) || 0,
            totalExpense: Number(r.total_expense) || 0,
        }));
    }

    async getExpensesByCategory(userId: number) {
        const rows = await this.transactionRepo
            .createQueryBuilder('t')
            .leftJoin('t.category', 'c')
            .select('c.name', 'category')
            .addSelect('SUM(t.amount)', 'total_expense')
            .where('t.userId = :userId', { userId })
            .andWhere('t.type = :expense', { expense: TransactionType.EXPENSE })
            .groupBy('c.name')
            .orderBy('total_expense', 'DESC')
            .getRawMany();

        return rows.map(r => ({
            category: r.category ?? 'Uncategorized',
            totalExpense: Number(r.total_expense) || 0,
        }));
    }

    async getIncomesByCategory(userId: number) {
        const rows = await this.transactionRepo
            .createQueryBuilder('t')
            .leftJoin('t.category', 'c')
            .select('c.name', 'category')
            .addSelect('SUM(t.amount)', 'total_income')
            .where('t.userId = :userId', { userId })
            .andWhere('t.type = :income', { income: TransactionType.INCOME })
            .groupBy('c.name')
            .orderBy('total_income', 'DESC')
            .getRawMany();

        return rows.map(r => ({
            category: r.category ?? 'Uncategorized',
            totalIncome: Number(r.total_income) || 0,
        }));
    }
}
