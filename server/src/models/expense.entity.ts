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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export enum SplitType {
    ALL = 'ALL',
    SELECTED = 'SELECTED',
  }
  
  @Entity()
  export class Expense {
    @ApiProperty({description: "Id of the expense"})
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({description: "Relation to group"})
    @ManyToOne(() => Group, (g) => g.id, { onDelete: 'CASCADE', eager: true })
    group: Group;
    
    @ApiProperty({description: "Payer id"})
    @ManyToOne(() => User, (u) => u.id, { eager: true, onDelete: 'SET NULL' })
    payer: User; // the person who paid
  
    // TypeORM returns decimal as string; keep precision
    @ApiProperty({description: "Amount paid"})
    @Column('decimal', { precision: 12, scale: 2 })
    amount: string;
    
    @ApiPropertyOptional({description: "Description of expense"})
    @Column({ nullable: true })
    note: string;
    
    @ApiPropertyOptional({description: "Split type of expense, defaults to ALL"})
    @Column({ type: 'enum', enum: SplitType, default: SplitType.ALL })
    splitType: SplitType;
    
    @ApiProperty({description: "expense creation date"})
    @CreateDateColumn()
    createdAt: Date;
    
    @OneToMany(() => ExpenseParticipant, (p) => p.expense, { cascade: true, eager: true })
    participants: ExpenseParticipant[];
  }
  