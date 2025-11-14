import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../models/user.entity';
import { Group } from '../models/group.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (g) => g.id, { onDelete: 'CASCADE', eager: true })
  group: Group;

  @ManyToOne(() => User, (u) => u.id, { eager: true })
  fromUser: User; // payer of this repayment

  @ManyToOne(() => User, (u) => u.id, { eager: true })
  toUser: User; // receiver of this repayment

  @Column('decimal', { precision: 12, scale: 2 })
  amount: string;

  @CreateDateColumn()
  date: Date;

  @Column({ nullable: true })
  note: string;
}
