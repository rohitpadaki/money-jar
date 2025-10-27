import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from 'src/services/group/group.service';
import { GroupsController } from 'src/controllers/group/group.controller';
import { Group } from 'src/models/group.entity';
import { GroupMember } from 'src/models/group-member.entity';
import { User } from 'src/models/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember, User]), AuthModule],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [TypeOrmModule.forFeature([Group, GroupMember, User])]
})
export class GroupsModule {}
