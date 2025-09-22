// groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Group } from 'src/models/group.entity';
import { GroupMember } from 'src/models/group-member.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(GroupMember) private memberRepo: Repository<GroupMember>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }

  async createGroup(userId: number, name: string) {
    return this.dataSource.transaction(async (manager) => {
      // find the creator user (must exist)
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // create the group
      const group = manager.create(Group, {
        name,
        createdBy: user,
      });
      const savedGroup = await manager.save(group);

      // add the creator as a member
      const member = manager.create(GroupMember, {
        group: savedGroup,
        user,
      });
      await manager.save(member);

      return savedGroup;
    });
  }

  async getUserGroups(userId: number) {
    const memberships = await this.memberRepo.find({
      where: { user: { id: userId } },
      relations: ['group', 'group.createdBy', 'group.members'],
    });

    return memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      createdBy: { id: m.group.createdBy.id, username: m.group.createdBy.username },
      memberCount: m.group.members.length,
    }));
  }

  async getGroupDetails(groupId: string) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ['createdBy', 'members', 'members.user'],
    });

    if (!group) throw new NotFoundException('Group not found');

    return {
      id: group.id,
      name: group.name,
      createdBy: { id: group.createdBy.id, username: group.createdBy.username },
      members: group.members.map((m) => ({
        id: m.user.id,
        username: m.user.username,
        joinedAt: m.joinedAt,
      })),
      createdAt: group.createdAt,
    };
  }

}
