import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, group => group.members, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, user => user.groupMemberships, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  joinedAt: Date;
}
