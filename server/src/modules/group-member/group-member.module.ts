import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/models/group-member.entity';
import { Group } from 'src/models/group.entity';
import { User } from 'src/models/user.entity';
import { GroupMembersService } from 'src/services/group-member/group-member.service';
import { GroupMembersController } from 'src/controllers/group-member/group-member.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Group, User]), AuthModule],
  providers: [GroupMembersService],
  controllers: [GroupMembersController],
  exports: [GroupMembersService, TypeOrmModule.forFeature([GroupMember, Group, User])],
})
export class GroupMembersModule {}
