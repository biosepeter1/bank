import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface TransferLimits {
  dailyLimit: number;
  monthlyLimit: number;
  singleTransferLimit: number;
  internalFeePercent: number;
  domesticFeePercent: number;
  internationalFeePercent: number;
  minFee: number;
}

@Injectable()
export class TransferLimitsService {
  constructor(private prisma: PrismaService) {}

  // Default limits (can be overridden per user or from database)
  private defaultLimits: TransferLimits = {
    dailyLimit: 1000000, // 1M NGN per day
    monthlyLimit: 10000000, // 10M NGN per month
    singleTransferLimit: 500000, // 500K NGN per transaction
    internalFeePercent: 0, // No fee for internal transfers
    domesticFeePercent: 0.5, // 0.5% for domestic
    internationalFeePercent: 2, // 2% for international
    minFee: 10, // Minimum fee of 10 NGN/USD
  };

  /**
   * Calculate transfer fee based on type and amount
   */
  calculateFee(amount: number, transferType: 'INTERNAL' | 'DOMESTIC' | 'INTERNATIONAL'): number {
    let feePercent = 0;

    switch (transferType) {
      case 'INTERNAL':
        feePercent = this.defaultLimits.internalFeePercent;
        break;
      case 'DOMESTIC':
        feePercent = this.defaultLimits.domesticFeePercent;
        break;
      case 'INTERNATIONAL':
        feePercent = this.defaultLimits.internationalFeePercent;
        break;
    }

    const calculatedFee = (amount * feePercent) / 100;
    
    // Apply minimum fee for non-internal transfers
    if (transferType !== 'INTERNAL') {
      return Math.max(calculatedFee, this.defaultLimits.minFee);
    }

    return calculatedFee;
  }

  /**
   * Check if transfer amount exceeds single transaction limit
   */
  checkSingleTransferLimit(amount: number): void {
    if (amount > this.defaultLimits.singleTransferLimit) {
      throw new BadRequestException(
        `Transfer amount exceeds single transaction limit of ${this.defaultLimits.singleTransferLimit.toLocaleString()}`
      );
    }
  }

  /**
   * Check daily and monthly transfer limits
   */
  async checkTransferLimits(userId: string, amount: number): Promise<void> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get today's transfers
    const dailyTransfers = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'TRANSFER',
        status: 'COMPLETED',
        createdAt: { gte: startOfDay },
      },
      _sum: { amount: true },
    });

    const dailyTotal = Number(dailyTransfers._sum.amount || 0);

    if (dailyTotal + amount > this.defaultLimits.dailyLimit) {
      throw new BadRequestException(
        `Daily transfer limit exceeded. Limit: ${this.defaultLimits.dailyLimit.toLocaleString()}, ` +
        `Used: ${dailyTotal.toLocaleString()}, Remaining: ${(this.defaultLimits.dailyLimit - dailyTotal).toLocaleString()}`
      );
    }

    // Get this month's transfers
    const monthlyTransfers = await this.prisma.transaction.aggregate({
      where: {
        userId,
        type: 'TRANSFER',
        status: 'COMPLETED',
        createdAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    const monthlyTotal = Number(monthlyTransfers._sum.amount || 0);

    if (monthlyTotal + amount > this.defaultLimits.monthlyLimit) {
      throw new BadRequestException(
        `Monthly transfer limit exceeded. Limit: ${this.defaultLimits.monthlyLimit.toLocaleString()}, ` +
        `Used: ${monthlyTotal.toLocaleString()}, Remaining: ${(this.defaultLimits.monthlyLimit - monthlyTotal).toLocaleString()}`
      );
    }
  }

  /**
   * Get user's remaining limits
   */
  async getRemainingLimits(userId: string): Promise<{
    daily: { limit: number; used: number; remaining: number };
    monthly: { limit: number; used: number; remaining: number };
    singleTransaction: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [dailyTransfers, monthlyTransfers] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          createdAt: { gte: startOfDay },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    const dailyUsed = Number(dailyTransfers._sum.amount || 0);
    const monthlyUsed = Number(monthlyTransfers._sum.amount || 0);

    return {
      daily: {
        limit: this.defaultLimits.dailyLimit,
        used: dailyUsed,
        remaining: this.defaultLimits.dailyLimit - dailyUsed,
      },
      monthly: {
        limit: this.defaultLimits.monthlyLimit,
        used: monthlyUsed,
        remaining: this.defaultLimits.monthlyLimit - monthlyUsed,
      },
      singleTransaction: this.defaultLimits.singleTransferLimit,
    };
  }

  /**
   * Get fee information for display
   */
  getFeeInfo() {
    return {
      internal: { percent: this.defaultLimits.internalFeePercent, min: 0 },
      domestic: { percent: this.defaultLimits.domesticFeePercent, min: this.defaultLimits.minFee },
      international: { percent: this.defaultLimits.internationalFeePercent, min: this.defaultLimits.minFee },
    };
  }
}
