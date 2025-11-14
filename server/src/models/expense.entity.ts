import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from '../models/user.entity';
  import { Group } from '../models/group.entity';
  import { ExpenseParticipant } from '../models/expense-participant.entity';
  
  export enum SplitType {
    ALL = 'ALL',
    SELECTED = 'SELECTED',
  }
  
  @Entity()
  export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Group, (g) => g.id, { onDelete: 'CASCADE', eager: true })
    group: Group;
  
    @ManyToOne(() => User, (u) => u.id, { eager: true, onDelete: 'SET NULL' })
    payer: User; // the person who paid
  
    // TypeORM returns decimal as string; keep precision
    @Column('decimal', { precision: 12, scale: 2 })
    amount: string;
  
    @Column({ nullable: true })
    note: string;
  
    @Column({ type: 'enum', enum: SplitType, default: SplitType.ALL })
    splitType: SplitType;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @OneToMany(() => ExpenseParticipant, (p) => p.expense, { cascade: true, eager: true })
    participants: ExpenseParticipant[];
  }
  