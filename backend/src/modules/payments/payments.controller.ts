import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Headers,
  type RawBodyRequest,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  InitiateDepositDto,
  VerifyPaymentDto,
  AddBankAccountDto,
  InitiateWithdrawalDto,
  ResolveAccountDto,
  PaymentStatusResponseDto,
  BankListResponseDto,
  BankAccountResponseDto,
  WithdrawalResponseDto,
  ResolveAccountResponseDto,
} from './dto/payment.dto';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: UserRole;
  };
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly webhookService: WebhookService,
  ) {}

  @Post('deposits/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Initiate a deposit payment',
    description: 'Create a new deposit payment and get authorization URL for payment gateway'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Deposit initiated successfully',
    schema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string', description: 'Payment ID' },
        reference: { type: 'string', description: 'Payment reference' },
        authorizationUrl: { type: 'string', description: 'Payment gateway URL' },
        accessCode: { type: 'string', description: 'Payment access code' },
        amount: { type: 'number', description: 'Payment amount' },
        status: { type: 'string', description: 'Payment status' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async initiateDeposit(
    @Req() req: AuthenticatedRequest,
    @Body() dto: InitiateDepositDto,
  ) {
    return this.paymentsService.initiateDeposit(req.user.sub, dto);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Verify payment status',
    description: 'Verify payment with payment gateway and update local status'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment verified successfully',
    schema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string', description: 'Payment ID' },
        reference: { type: 'string', description: 'Payment reference' },
        status: { type: 'string', description: 'Payment status' },
        amount: { type: 'number', description: 'Paid amount' },
        paidAt: { type: 'string', description: 'Payment date' },
        channel: { type: 'string', description: 'Payment channel' },
        gatewayResponse: { type: 'string', description: 'Gateway response' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Get('status/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get payment status',
    description: 'Get the current status of a payment'
  })
  @ApiResponse({ status: 200, description: 'Payment status retrieved', type: PaymentStatusResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentStatus(
    @Req() req: AuthenticatedRequest,
    @Param('paymentId') paymentId: string,
  ): Promise<PaymentStatusResponseDto> {
    return this.paymentsService.getPaymentStatus(paymentId, req.user.sub);
  }

  @Get('banks')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get supported banks',
    description: 'Get list of banks supported for transfers and withdrawals'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Banks retrieved successfully', 
    type: [BankListResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBanks(): Promise<BankListResponseDto[]> {
    return this.paymentsService.getBanks();
  }

  @Post('banks/resolve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Resolve bank account',
    description: 'Verify and get details of a bank account'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Account resolved successfully', 
    type: ResolveAccountResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid account details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resolveAccount(@Body() dto: ResolveAccountDto): Promise<ResolveAccountResponseDto> {
    return this.paymentsService.resolveAccount(dto);
  }

  @Post('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Add bank account',
    description: 'Add a new bank account for withdrawals'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Bank account added successfully', 
    type: BankAccountResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Bank account already exists' })
  async addBankAccount(
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    return this.paymentsService.addBankAccount(req.user.sub, dto);
  }

  @Get('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user bank accounts',
    description: 'Get all bank accounts for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bank accounts retrieved successfully', 
    type: [BankAccountResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBankAccounts(
    @Req() req: AuthenticatedRequest,
  ): Promise<BankAccountResponseDto[]> {
    return this.paymentsService.getBankAccounts(req.user.sub);
  }

  @Post('withdrawals/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Initiate withdrawal',
    description: 'Create a new withdrawal request to a bank account'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Withdrawal initiated successfully',
    schema: {
      type: 'object',
      properties: {
        withdrawalId: { type: 'string', description: 'Withdrawal ID' },
        reference: { type: 'string', description: 'Withdrawal reference' },
        amount: { type: 'number', description: 'Withdrawal amount' },
        fee: { type: 'number', description: 'Processing fee' },
        totalAmount: { type: 'number', description: 'Total deducted amount' },
        status: { type: 'string', description: 'Withdrawal status' },
        bankAccount: { 
          type: 'object',
          properties: {
            accountName: { type: 'string' },
            accountNumber: { type: 'string' },
            bankName: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async initiateWithdrawal(
    @Req() req: AuthenticatedRequest,
    @Body() dto: InitiateWithdrawalDto,
  ) {
    return this.paymentsService.initiateWithdrawal(req.user.sub, dto);
  }

  @Get('withdrawals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user withdrawals',
    description: 'Get all withdrawals for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Withdrawals retrieved successfully', 
    type: [WithdrawalResponseDto] 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getWithdrawals(
    @Req() req: AuthenticatedRequest,
  ): Promise<WithdrawalResponseDto[]> {
    return this.paymentsService.getWithdrawals(req.user.sub);
  }

  @Post('webhook/paystack')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Paystack webhook endpoint',
    description: 'Handle webhook events from Paystack payment gateway'
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  async handlePaystackWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      this.logger.warn('Webhook received without signature');
      throw new BadRequestException('Missing webhook signature');
    }

    const payload = req.rawBody?.toString('utf8') || '';
    
    if (!payload) {
      this.logger.warn('Webhook received with empty payload');
      throw new BadRequestException('Empty webhook payload');
    }

    this.logger.log(`Received Paystack webhook: ${signature.substring(0, 20)}...`);
    return this.webhookService.handlePaystackWebhook(signature, payload);
  }

  // Admin endpoints
  @Get('admin/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BANK_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all payments (Admin)',
    description: 'Get all payments in the system - admin only'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'provider', required: false, type: String, description: 'Filter by provider' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getAdminPayments(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('status') status?: string,
    @Query('provider') provider?: string,
  ) {
    // This would be implemented to get paginated payments for admin
    // For now, return a placeholder response
    return {
      message: 'Admin payments endpoint - to be implemented',
      filters: { page: parseInt(page), limit: parseInt(limit), status, provider },
    };
  }

  @Get('admin/withdrawals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BANK_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all withdrawals (Admin)',
    description: 'Get all withdrawals in the system - admin only'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getAdminWithdrawals(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('status') status?: string,
  ) {
    // This would be implemented to get paginated withdrawals for admin
    // For now, return a placeholder response
    return {
      message: 'Admin withdrawals endpoint - to be implemented',
      filters: { page: parseInt(page), limit: parseInt(limit), status },
    };
  }
}
