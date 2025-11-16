import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from 'src/services/payment/payment.service';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  async create(@Request() req: any, @Param('groupId') groupId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment({id: req.user.sub}, groupId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List payments for a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  async list(@Param('groupId') groupId: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    const l = limit ? Number(limit) : 50;
    const o = offset ? Number(offset) : 0;
    return this.paymentService.listPayments(groupId, l, o);
  }

  // Settle-up POV endpoint
  @Get('/balances/settle')
  @ApiOperation({ summary: 'Compute balances for the current user in a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  async settle(@Request() req: any, @Param('groupId') groupId: string) {
    return this.paymentService.computeBalances(req.user.sub, groupId);
  }
}
