import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { GroupMember } from './group-member.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({description: "Name of the Group/Hive"})
  @Column()
  name: string;

  @ApiProperty({description: "ID of user who created the group"})
  @ManyToOne(() => User, user => user.createdGroups)
  createdBy: User;

  @OneToMany(() => GroupMember, member => member.group, { cascade: true })
  members: GroupMember[];

  @CreateDateColumn()
  createdAt: Date;
}
