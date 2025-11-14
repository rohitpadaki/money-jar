import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/models/payment.entity';
import { Group } from 'src/models/group.entity';
import { User } from 'src/models/user.entity';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { ExpenseParticipant } from 'src/models/expense-participant.entity';
import { Expense } from 'src/models/expense.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ExpenseParticipant) private expPartRepo: Repository<ExpenseParticipant>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
  ) {}

  private toCentsFromStringOrNumber(value: string | number): number {
    const v = typeof value === 'string' ? parseFloat(value) : value;
    return Math.round(v * 100);
  }

  private centsToNumber(cents: number): number {
    return +(cents / 100).toFixed(2);
  }

  async createPayment(requestor: { id: number | string }, groupId: string, dto: CreatePaymentDto) {
    // Validate group and membership
    const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ['members', 'members.user'] });
    if (!group) throw new NotFoundException('Group not found');

    const memberIds = new Set(group.members.map((m) => String(m.user.id)));
    if (!memberIds.has(String(dto.toUserId))) throw new BadRequestException('toUser is not a member of the group');
    if (!memberIds.has(String(requestor.id))) throw new ForbiddenException('From user must be a group member');

    if (Number(dto.amount) <= 0) throw new BadRequestException('Amount must be positive');

    const fromUser = await this.userRepo.findOne({ where: { id: String(requestor.id) } });
    const toUser = await this.userRepo.findOne({ where: { id: dto.toUserId } });
    if (!fromUser || !toUser) throw new NotFoundException('Users not found');

    const p = this.paymentRepo.create({
      group,
      fromUser,
      toUser,
      amount: dto.amount.toFixed(2),
      note: dto.note,
    });

    return this.paymentRepo.save(p);
  }

  async listPayments(groupId: string, limit = 50, offset = 0) {
    return this.paymentRepo.find({
      where: { group: { id: groupId } as any },
      relations: ['fromUser', 'toUser'],
      order: { date: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * computeBalances(requestorId, groupId)
   * returns a map: { otherUserId: number } meaning how much the OTHER user owes REQUESTOR (positive -> they owe requestor)
   */
  async computeBalances(requestorId: string | number, groupId: string) {
    // 1) get all group members
    const group = await this.groupRepo.findOne({ where: { id: groupId }, relations: ['members', 'members.user'] });
    if (!group) throw new NotFoundException('Group not found');

    const members = group.members.map((m) => m.user);
    const otherMemberIds = members.filter((u) => String(u.id) !== String(requestorId)).map((u) => String(u.id));

    // Prepare maps (all cents)
    const mapPaidByReq = new Map<string, number>(); // how much requestor paid for others
    const mapPaidForReq = new Map<string, number>(); // how much others paid for requestor
    const mapPaymentsFrom = new Map<string, number>(); // payments from other -> requestor
    const mapPaymentsTo = new Map<string, number>();   // payments from requestor -> other

    // 1) paid_by_requestor_for_others:
    // sum(ep.share) grouped by ep.userId where ep.expense.payerId = requestor
    const paidByReqRows = await this.expPartRepo
      .createQueryBuilder('ep')
      .select('ep.userId', 'userId')
      .addSelect('SUM(ep.share)', 'amount')
      .innerJoin('ep.expense', 'e')
      .where('e.groupId = :groupId', { groupId })
      .andWhere('e.payerId = :req', { req: String(requestorId) })
      .groupBy('ep.userId')
      .getRawMany();

    for (const r of paidByReqRows) {
      // r.amount is string like '30.00'
      const cents = Math.round(parseFloat(r.amount) * 100);
      mapPaidByReq.set(String(r.userId), cents);
    }

    // 2) paid_by_others_for_requestor:
    // where ep.userId = requestor (i.e., requestor was participant), group by e.payerId
    const paidForReqRows = await this.expPartRepo
      .createQueryBuilder('ep')
      .select('e.payerId', 'payerId')
      .addSelect('SUM(ep.share)', 'amount')
      .innerJoin('ep.expense', 'e')
      .where('e.groupId = :groupId', { groupId })
      .andWhere('ep.userId = :req', { req: String(requestorId) })
      .andWhere('e.payerId != :req', { req: String(requestorId) })
      .groupBy('e.payerId')
      .getRawMany();

    for (const r of paidForReqRows) {
      const cents = Math.round(parseFloat(r.amount) * 100);
      mapPaidForReq.set(String(r.payerId), cents);
    }

    // 3) payments grouped (only those payments involving requestor)
    const paymentRows = await this.paymentRepo
      .createQueryBuilder('p')
      .select('p.fromUserId', 'fromUserId')
      .addSelect('p.toUserId', 'toUserId')
      .addSelect('SUM(p.amount)', 'amount')
      .where('p.groupId = :groupId', { groupId })
      .andWhere('(p.fromUserId = :req OR p.toUserId = :req)', { req: String(requestorId) })
      .groupBy('p.fromUserId')
      .addGroupBy('p.toUserId')
      .getRawMany();

    for (const r of paymentRows) {
      const cents = Math.round(parseFloat(r.amount) * 100);
      const from = String(r.fromUserId);
      const to = String(r.toUserId);
      if (to === String(requestorId) && from !== String(requestorId)) {
        // other -> requestor
        mapPaymentsFrom.set(from, (mapPaymentsFrom.get(from) || 0) + cents);
      } else if (from === String(requestorId) && to !== String(requestorId)) {
        // requestor -> other
        mapPaymentsTo.set(to, (mapPaymentsTo.get(to) || 0) + cents);
      }
    }

    // Now compute final per-user balances (in cents)
    const result: Record<string, number> = {};
    for (const otherId of otherMemberIds) {
      const paidByReq = mapPaidByReq.get(otherId) || 0;
      const paidForReq = mapPaidForReq.get(otherId) || 0;
      const paymentsFromOther = mapPaymentsFrom.get(otherId) || 0;
      const paymentsFromReq = mapPaymentsTo.get(otherId) || 0;

      // amount other owes requestor in cents:
      // (requestor paid for other) - (other paid for requestor) - (other -> requestor payments) + (??)
      // We subtract payments both ways: a payment from requestor to other reduces how much other owes requestor (i.e., makes requestor owe more)
      // Using the formula discussed earlier:
      const cents = paidByReq - paidForReq - paymentsFromOther + paymentsFromReq;

      // Interpretation: positive -> other owes requestor. negative -> requestor owes other.
      result[otherId] = +(cents / 100).toFixed(2);
    }

    // Optionally include own totals:
    // totalOwedToRequestor = sum of positive values
    // totalOwingByRequestor = sum of negative values (in absolute)
    let totalOwedToRequestor = 0;
    let totalOwingByRequestor = 0;
    for (const k of Object.keys(result)) {
      const v = result[k];
      if (v > 0) totalOwedToRequestor += v;
      else totalOwingByRequestor += Math.abs(v);
    }

    return {
      requestorId: String(requestorId),
      groupId,
      balances: result,
      totalOwedToRequestor: +totalOwedToRequestor.toFixed(2),
      totalOwingByRequestor: +totalOwingByRequestor.toFixed(2),
    };
  }
}
