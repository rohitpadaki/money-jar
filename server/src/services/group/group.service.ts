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
  ) {}

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
}
