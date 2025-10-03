import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from 'src/models/group-member.entity';
import { Group } from 'src/models/group.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class GroupMembersService {
    constructor(
        @InjectRepository(GroupMember) private groupMemberRepo: Repository<GroupMember>,
        @InjectRepository(Group) private groupRepo: Repository<Group>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) { }

    async addMember(groupId: string, userId: string, requesterId: string) {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ['createdBy'],
        });
        if (!group) throw new NotFoundException('Group not found');

        if (group.createdBy.id !== requesterId) {
            throw new ForbiddenException('Only the group creator can add members');
        }

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const member = this.groupMemberRepo.create({ group, user });
        return this.groupMemberRepo.save(member);
    }

    async removeMember(groupId: string, userId: string, requesterId: string) {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ['createdBy'],
        });
        if (!group) throw new NotFoundException('Group not found');

        if (group.createdBy.id !== requesterId) {
            throw new ForbiddenException('Only the group creator can remove members');
        }

        await this.groupMemberRepo.delete({ group: { id: groupId }, user: { id: userId } });
        return { message: 'Member removed' };
    }

    async listMembers(groupId: string) {
        return this.groupMemberRepo.find({
            where: { group: { id: groupId } },
            relations: ['user'],
        });
    }

    async leaveGroup(groupId: string, userId: string) {
        const group = await this.groupRepo.findOne({
            where: { id: groupId },
            relations: ['createdBy'], // 👈 ensure we can access createdBy.id
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        // ✅ Prevent creator from leaving
        if (group.createdBy.id === userId) {
            throw new BadRequestException('Group creator cannot leave the group');
        }

        const result = await this.groupMemberRepo.delete({
            group: { id: groupId },
            user: { id: userId },
        });

        if (result.affected === 0) {
            throw new NotFoundException('You are not a member of this group');
        }

        return { message: 'You have left the group' };
    }


}
