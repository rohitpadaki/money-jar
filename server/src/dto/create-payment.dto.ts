import { IsNumber, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  toUserId: string;

  @IsNumber()
  amount: number; // numeric e.g., 50.75

  @IsOptional()
  @IsString()
  note?: string;
}
