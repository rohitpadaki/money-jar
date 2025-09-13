// src/transaction/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

}
