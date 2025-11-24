// src/category/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({description: "Name of the Category", example:"Food"})
  @Column()
  name: string;

  @ApiProperty({description: "Type of Transaction", example: "EXPENSE"})
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
