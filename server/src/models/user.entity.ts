import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];

    @OneToMany(() => Group, group => group.createdBy)
    createdGroups: Group[];

    @OneToMany(() => GroupMember, member => member.user)
    groupMemberships: GroupMember[];
}