import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { DepositDto, WithdrawDto, TransferDto } from './dto/wallet.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { EmailVerifiedGuard } from '../../common/guards/email-verified.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireEmailVerified } from '../../common/decorators/email-verified.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TransferLimitsService } from '../../common/services/transfer-limits.service';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transferLimitsService: TransferLimitsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  getBalance(@CurrentUser() user: any) {
    return this.walletService.getBalance(user.id);
  }

  @Get('limits')
  @ApiOperation({ summary: 'Get transfer limits and fees' })
  @ApiResponse({ status: 200, description: 'Limits retrieved successfully' })
  async getLimits(@CurrentUser() user: any) {
    const [limits, fees] = await Promise.all([
      this.transferLimitsService.getRemainingLimits(user.id),
      Promise.resolve(this.transferLimitsService.getFeeInfo()),
    ]);
    return { limits, fees };
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money into wallet' })
  @ApiResponse({ status: 201, description: 'Deposit successful' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.walletService.deposit(user.id, depositDto);
  }

  @Post('withdraw')
  @RequireEmailVerified()
  @ApiOperation({ summary: 'Withdraw money from wallet' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return this.walletService.withdraw(user.id, withdrawDto);
  }

  @Post('transfer')
  @RequireEmailVerified()
  @ApiOperation({ summary: 'Transfer money to another user' })
  @ApiResponse({ status: 201, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  transfer(@CurrentUser() user: any, @Body() transferDto: TransferDto) {
    return this.walletService.transfer(user.id, transferDto);
  }

  // Admin endpoints
  @Post('admin/:userId/adjust')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Adjust user balance (Admin only)' })
  @ApiResponse({ status: 201, description: 'Balance adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User wallet not found' })
  adminAdjustBalance(
    @Param('userId') userId: string,
    @CurrentUser() admin: any,
    @Body() adjustDto: { amount: number; type: 'CREDIT' | 'DEBIT'; reason: string },
  ) {
    return this.walletService.adminAdjustBalance(
      userId,
      admin.id,
      adjustDto.amount,
      adjustDto.type,
      adjustDto.reason,
    );
  }

  @Post('admin/:userId/clear')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Clear user account balance to zero (Admin only)' })
  @ApiResponse({ status: 201, description: 'Account cleared successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User wallet not found' })
  adminClearAccount(
    @Param('userId') userId: string,
    @CurrentUser() admin: any,
    @Body() clearDto: { reason: string },
  ) {
    return this.walletService.adminClearAccount(
      userId,
      admin.id,
      clearDto.reason,
    );
  }
}
