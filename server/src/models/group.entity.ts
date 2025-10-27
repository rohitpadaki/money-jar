import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { GroupMember } from './group-member.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.createdGroups)
  createdBy: User;

  @OneToMany(() => GroupMember, member => member.group, { cascade: true })
  members: GroupMember[];

  @CreateDateColumn()
  createdAt: Date;
}
