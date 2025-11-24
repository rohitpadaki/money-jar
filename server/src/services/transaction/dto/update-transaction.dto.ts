import { TransactionType } from "src/enums/transaction-type.enum";
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateTransactionDto {
  @ApiProperty({description: "Updated Amount"})
  @IsNumber()
  amount: number;

  @ApiProperty({description: "Updated Transaction Type"})
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({description: "Updated Note"})
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({description: "Updated Category Id"})
  categoryId?: string;
}
