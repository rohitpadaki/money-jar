// src/transaction/dto/create-transaction.dto.ts
export class CreateTransactionDto {
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  categoryId?: number;
}
