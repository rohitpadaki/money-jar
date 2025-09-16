// src/category/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
