import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { EmailService } from '@/common/services/email.service';

@Injectable()
export class WithdrawalsService {
  private readonly logger = new Logger(WithdrawalsService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  /**
   * Initiate a withdrawal request
   */
  async initiateWithdrawal(userId: string, data: CreateWithdrawalDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const amount = new Decimal(data.amount);

    // Check balance
    if (user.wallet.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance for withdrawal');
    }

    // Calculate fees
    const fee = this.calculateWithdrawalFee(amount, data.withdrawalMethod);
    const totalDebit = amount.add(fee);

    // Check if total debit exceeds balance
    if (user.wallet.balance.lessThan(totalDebit)) {
      throw new BadRequestException('Insufficient balance including withdrawal fee');
    }

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        userId,
        amount,
        fee,
        totalAmount: totalDebit,
        status: 'PENDING',
        description: `${data.withdrawalMethod} - ${data.accountName} (${data.accountNumber}) - ${data.narration || ''}`,
        reference: `WD-${Date.now()}-${userId.slice(0, 8)}`,
      },
    });

    return withdrawal;
  }

  /**
   * Calculate withdrawal fee based on method and amount
   */
  private calculateWithdrawalFee(amount: Decimal, method: string): Decimal {
    // Example fee structure
    const feePercentage = method === 'BANK_TRANSFER' ? 0.0075 : 0.01; // 0.75% or 1%
    const fee = amount.mul(new Decimal(feePercentage));
    const minFee = new Decimal(50);
    const maxFee = new Decimal(500);

    if (fee.lessThan(minFee)) return minFee;
    if (fee.greaterThan(maxFee)) return maxFee;
    return fee;
  }

  /**
   * Approve a withdrawal request
   */
  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: { include: { wallet: true } } },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Withdrawal can only be approved if pending');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Debit wallet
      const walletBefore = withdrawal.user.wallet;
      const walletAfter = walletBefore.balance.sub(withdrawal.totalAmount);

      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: { balance: walletAfter },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: withdrawal.userId,
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          amount: withdrawal.amount,
          balanceBefore: walletBefore.balance,
          balanceAfter: walletAfter,
          description: `Withdrawal - ${withdrawal.description}`,
          reference: withdrawal.id,
        },
      });

      // Update withdrawal status
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'SUCCESS',
          processedAt: new Date(),
        },
      });

      return updatedWithdrawal;
    });

    // Send email notification if enabled (non-blocking)
    try {
      if (withdrawal.user.emailTransactions) {
        const walletAfter = withdrawal.user.wallet.balance.sub(withdrawal.totalAmount);
        await this.email.sendTransactionEmail({
          email: withdrawal.user.email,
          firstName: withdrawal.user.firstName,
          transactionType: 'WITHDRAWAL',
          amount: withdrawal.amount.toString(),
          currency: withdrawal.user.wallet.currency,
          balance: walletAfter.toString(),
          reference: withdrawal.id,
          description: `Withdrawal - ${withdrawal.description}`,
        });
      }
    } catch (error) {
      console.error('Failed to send withdrawal email:', error);
    }

    return result;
  }

  /**
   * Reject a withdrawal request
   */
  async rejectWithdrawal(withdrawalId: string, reason: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Only pending withdrawals can be rejected');
    }

    return this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'FAILED',
        failureReason: reason,
        processedAt: new Date(),
      },
    });
  }

  /**
   * Get withdrawal history
   */
  async getWithdrawalHistory(userId: string, limit = 20, skip = 0) {
    return this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });
  }

  /**
   * Get withdrawal details
   */
  async getWithdrawalById(userId: string, withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal || withdrawal.userId !== userId) {
      throw new NotFoundException('Withdrawal not found or unauthorized');
    }

    return withdrawal;
  }

  /**
   * Cancel a withdrawal request
   */
  async cancelWithdrawal(userId: string, withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal || withdrawal.userId !== userId) {
      throw new NotFoundException('Withdrawal not found or unauthorized');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new BadRequestException('Only pending withdrawals can be cancelled');
    }

    return this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'CANCELLED' },
    });
  }
}
