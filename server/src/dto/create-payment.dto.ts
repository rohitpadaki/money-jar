import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsUUID, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({description: "User ID of Person we are paying to"})
  @IsUUID()
  toUserId: string;

  @ApiProperty({description: "Amount of money being paid"})
  @IsNumber()
  amount: number; // numeric e.g., 50.75

  @ApiPropertyOptional({description: "A description for logging the Payment"})
  @IsOptional()
  @IsString()
  note?: string;
}
