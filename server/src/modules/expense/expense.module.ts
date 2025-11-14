import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../../models/expense.entity';
import { ExpenseParticipant } from '../../models/expense-participant.entity';
import { ExpenseService } from 'src/services/expense/expense.service';
import { ExpenseController } from 'src/controllers/expense/expense.controller';
import { Group } from 'src/models/group.entity';
import { GroupMember } from 'src/models/group-member.entity';
import { User } from 'src/models/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, ExpenseParticipant, Group, GroupMember, User]), AuthModule],
  providers: [ExpenseService],
  controllers: [ExpenseController],
  exports: [TypeOrmModule.forFeature([Expense, ExpenseParticipant, Group, GroupMember, User])]
})
export class ExpenseModule {}
