import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/models/payment.entity';
import { PaymentService } from 'src/services/payment/payment.service';
import { PaymentController } from 'src/controllers/payment/payment.controller';
import { Group } from 'src/models/group.entity';
import { User } from 'src/models/user.entity';
import { ExpenseParticipant } from 'src/models/expense-participant.entity';
import { Expense } from 'src/models/expense.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Group, User, ExpenseParticipant, Expense]), AuthModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [TypeOrmModule.forFeature([Payment, Group, User, ExpenseParticipant, Expense])]
})
export class PaymentModule {}
