import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../models/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ExpenseParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({description: "Relation with expense Id"})
  @ManyToOne(() => Expense, (e) => e.participants, { onDelete: 'CASCADE' })
  expense: Expense;

  @ApiProperty({description: "People participating in the expense"})
  @ManyToOne(() => User, (u) => u.groupMemberships, { eager: true })
  user: User;

  @Column('decimal', { precision: 12, scale: 2 })
  share: string; // how much this user owes for this expense
}
