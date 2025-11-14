import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from 'src/services/payment/payment.service';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Request() req: any, @Param('groupId') groupId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment({id: req.user.sub}, groupId, dto);
  }

  @Get()
  async list(@Param('groupId') groupId: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    const l = limit ? Number(limit) : 50;
    const o = offset ? Number(offset) : 0;
    return this.paymentService.listPayments(groupId, l, o);
  }

  // Settle-up POV endpoint
  @Get('/balances/settle')
  async settle(@Request() req: any, @Param('groupId') groupId: string) {
    return this.paymentService.computeBalances(req.user.sub, groupId);
  }
}
