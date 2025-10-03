import { TransactionType } from "src/enums/transaction-type.enum";
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  note?: string;

  categoryId?: string;
}
