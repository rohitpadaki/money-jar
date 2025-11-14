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
  
  export class CreateExpenseDto {
    @IsNumber()
    amount: number; // client sends as numeric, e.g., 120.5
  
    @IsOptional()
    @IsString()
    note?: string;
  
    @IsEnum(SplitType)
    splitType: SplitType;
  
    // Only required when splitType === SELECTED
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    participants?: string[];
  }
  