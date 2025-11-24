import { Controller, Post, Body, Param, UsePipes, ValidationPipe, Request, Get, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from 'src/services/payment/payment.service';
import { CreatePaymentDto } from 'src/dto/create-payment.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups/:groupId/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiCreatedResponse({
    description: 'Payment successfully created',
    schema: {
      example: {
        id: 'payment_123',
        group: { id: 'group_1', name: 'Trip to NYC' },
        fromUser: { id: 'user_1', username: 'Alice' },
        toUser: { id: 'user_2', username: 'Bob' },
        amount: '25.00',
        note: 'Lunch reimbursement',
        date: '2025-11-19T12:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or non-member recipient',
    schema: {
      example: { statusCode: 400, message: 'toUser is not a member of the group', error: 'Bad Request' },
    },
  })
  @ApiForbiddenResponse({
    description: 'Requestor is not a group member',
    schema: {
      example: { statusCode: 403, message: 'From user must be a group member', error: 'Forbidden' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group or users not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })  
  @Post()
  async create(@Request() req: any, @Param('groupId') groupId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment({id: req.user.sub}, groupId, dto);
  }

  @ApiOperation({ summary: 'List payments for a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiOkResponse({
    description: 'List of payments in the group',
    schema: {
      example: [
        {
          id: 'payment_123',
          fromUser: { id: 'user_1', username: 'Alice' },
          toUser: { id: 'user_2', username: 'Bob' },
          amount: '25.00',
          note: 'Lunch reimbursement',
          date: '2025-11-19T12:00:00.000Z',
        },
        {
          id: 'payment_124',
          fromUser: { id: 'user_3', username: 'Charlie' },
          toUser: { id: 'user_1', username: 'Alice' },
          amount: '10.00',
          note: 'Taxi split',
          date: '2025-11-18T15:45:00.000Z',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })
  @Get()
  async list(@Param('groupId') groupId: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    const l = limit ? Number(limit) : 50;
    const o = offset ? Number(offset) : 0;
    return this.paymentService.listPayments(groupId, l, o);
  }

  // Settle-up POV endpoint
  @ApiOperation({ summary: 'Compute balances for the current user in a group' })
  @ApiParam({ name: 'groupId', description: 'The ID of the group' })
  @ApiOkResponse({
    description: 'Balance summary for the requestor',
    schema: {
      example: {
        requestorId: 'user_1',
        groupId: 'group_1',
        balances: {
          user_2: 12.50,
          user_3: -7.25,
        },
        totalOwedToRequestor: 12.50,
        totalOwingByRequestor: 7.25,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not found',
    schema: {
      example: { statusCode: 404, message: 'Group not found', error: 'Not Found' },
    },
  })  
  @Get('/balances/settle')
  async settle(@Request() req: any, @Param('groupId') groupId: string) {
    return this.paymentService.computeBalances(req.user.sub, groupId);
  }
}
