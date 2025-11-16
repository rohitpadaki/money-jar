import { TransactionType } from "src/enums/transaction-type.enum";
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty({description: "Amount of money transfered in transaction0", example: "400"})
  @IsNumber()
  amount: number;

  @ApiProperty({description: "Type of transaction; INCOME or EXPENSE", example: "INCOME"})
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({description: "A note for your Transaction", example: "Uber Eats"})
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({description: "Id of Category which the Transaction lies to"})
  categoryId?: number;
}
