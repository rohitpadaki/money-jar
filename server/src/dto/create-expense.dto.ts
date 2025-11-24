import {
    IsNumber,
    IsString,
    IsOptional,
    IsEnum,
    IsArray,
    ArrayNotEmpty,
    IsUUID,
  } from 'class-validator';
  import { SplitType } from '../models/expense.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export class CreateExpenseDto {
    @ApiProperty({description: "Amount of money being spent on something", example: 3000})
    @IsNumber()
    amount: number; // client sends as numeric, e.g., 120.5
  
    @ApiPropertyOptional({description: "Describe your group expense", example: "Resort Dinner"})
    @IsOptional()
    @IsString()
    note?: string;
  
    @ApiProperty({description: "Split between all group members or selected", example:"ALL"})
    @IsEnum(SplitType)
    splitType: SplitType;
  
    // Only required when splitType === SELECTED
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    participants?: string[];
  }
  