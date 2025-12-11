import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name);

  // Investment plans with details
  private readonly investmentPlans = {
    BASIC: { name: 'Basic', minAmount: 1000, maxAmount: 50000, roi: 5, duration: 30 },
    STANDARD: { name: 'Standard', minAmount: 50000, maxAmount: 500000, roi: 8, duration: 60 },
    PREMIUM: { name: 'Premium', minAmount: 500000, maxAmount: 5000000, roi: 12, duration: 90 },
    VIP: { name: 'VIP', minAmount: 5000000, maxAmount: null, roi: 15, duration: 120 },
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Get available investment plans
   */
  getInvestmentPlans() {
    return this.investmentPlans;
  }

  /**
   * Create a new investment
   */
  async createInvestment(userId: string, data: CreateInvestmentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate plan
    const plan = this.investmentPlans[data.planType];
    if (!plan) {
      throw new BadRequestException('Invalid investment plan');
    }

    const amount = new Decimal(data.amount);

    // Validate amount
    if (amount.lessThan(new Decimal(plan.minAmount))) {
      throw new BadRequestException(`Minimum investment for ${plan.name} is ₦${plan.minAmount}`);
    }
    if (plan.maxAmount && amount.greaterThan(new Decimal(plan.maxAmount))) {
      throw new BadRequestException(`Maximum investment for ${plan.name} is ₦${plan.maxAmount}`);
    }

    // Check wallet balance
    if (user.wallet.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Calculate expected returns
    const roiAmount = amount.mul(new Decimal(plan.roi)).div(100);
    const totalReturn = amount.add(roiAmount);

    // Create investment transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Debit wallet
      const walletBefore = user.wallet.balance;
      const walletAfter = walletBefore.sub(amount);

      await tx.wallet.update({
        where: { userId },
        data: { balance: walletAfter },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: 'INVESTMENT',
          status: 'COMPLETED',
          amount,
          balanceBefore: walletBefore,
          balanceAfter: walletAfter,
          description: `Investment in ${plan.name} plan`,
          reference: `INV_${Date.now()}`,
        },
      });

      // Calculate maturity date
      const maturityDate = new Date();
      maturityDate.setDate(maturityDate.getDate() + plan.duration);

      // Create investment record
      const investment = await tx.investment.create({
        data: {
          userId,
          planType: data.planType,
          amount,
          roi: new Decimal(plan.roi),
          expectedReturn: roiAmount,
          duration: plan.duration,
          maturityDate,
          status: 'ACTIVE',
        },
      });

      return investment;
    });

    return result;
  }

  /**
   * Get user investments
   */
  async getUserInvestments(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get investment details
   */
  async getInvestmentById(userId: string, investmentId: string) {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
    });

    if (!investment || investment.userId !== userId) {
      throw new NotFoundException('Investment not found or unauthorized');
    }

    return investment;
  }

  /**
   * Calculate current interest accrued
   */
  calculateAccruedInterest(investment: any): number {
    if (investment.status !== 'ACTIVE') {
      return 0;
    }

    const now = new Date();
    const startDate = new Date(investment.startDate);
    const maturityDate = new Date(investment.maturityDate);

    const totalDays = (maturityDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    if (elapsedDays <= 0) return 0;
    if (elapsedDays >= totalDays) return investment.expectedReturn.toNumber();

    return (
      (investment.expectedReturn.toNumber() * elapsedDays) / totalDays
    );
  }

  /**
   * Get investment summary
   */
  async getInvestmentSummary(userId: string) {
    const investments = await this.getUserInvestments(userId);

    const summary = {
      totalInvested: new Decimal(0),
      activeInvestments: 0,
      completedInvestments: 0,
      totalExpectedReturn: new Decimal(0),
      accruedInterest: 0,
      investments: [],
    };

    investments.forEach((inv) => {
      summary.totalInvested = summary.totalInvested.add(inv.amount);
      summary.totalExpectedReturn = summary.totalExpectedReturn.add(inv.expectedReturn);

      if (inv.status === 'ACTIVE') {
        summary.activeInvestments++;
        summary.accruedInterest += this.calculateAccruedInterest(inv);
      } else if (inv.status === 'MATURED') {
        summary.completedInvestments++;
      }

      summary.investments.push({
        ...inv,
        accruedInterest: this.calculateAccruedInterest(inv),
        daysRemaining: Math.max(
          0,
          Math.ceil(
            (new Date(inv.maturityDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
          )
        ),
      });
    });

    return summary;
  }

  /**
   * Process matured investments (called by cron job)
   */
  async processMatureInvestments() {
    const now = new Date();

    const matureInvestments = await this.prisma.investment.findMany({
      where: {
        status: 'ACTIVE',
        maturityDate: {
          lte: now,
        },
      },
      include: { user: { include: { wallet: true } } },
    });

    this.logger.log(`Processing ${matureInvestments.length} mature investments`);

    for (const investment of matureInvestments) {
      await this.prisma.$transaction(async (tx) => {
        // Credit wallet with total return
        const walletBefore = investment.user.wallet.balance;
        const walletAfter = walletBefore.add(investment.expectedReturn);

        await tx.wallet.update({
          where: { userId: investment.userId },
          data: { balance: walletAfter },
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: investment.userId,
            type: 'INVESTMENT_MATURITY',
            status: 'COMPLETED',
            amount: investment.amount.add(investment.expectedReturn),
            balanceBefore: walletBefore,
            balanceAfter: walletAfter,
            description: `Investment maturity credit - Total return ₦${investment.amount.add(investment.expectedReturn)}`,
            reference: investment.id,
          },
        });

        // Mark investment as completed
        await tx.investment.update({
          where: { id: investment.id },
          data: { status: 'MATURED' },
        });
      });
    }

    return matureInvestments.length;
  }

  /**
   * Liquidate investment early (with penalty)
   */
  async liquidateInvestment(userId: string, investmentId: string) {
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
      include: { user: { include: { wallet: true } } },
    });

    if (!investment || investment.userId !== userId) {
      throw new NotFoundException('Investment not found or unauthorized');
    }

    if (investment.status !== 'ACTIVE') {
      throw new BadRequestException('Only active investments can be liquidated');
    }

    // Calculate penalty (10% of expected return)
    const penalty = investment.expectedReturn.mul(0.1);
    const returnAmount = investment.amount.add(investment.expectedReturn).sub(penalty);

    const result = await this.prisma.$transaction(async (tx) => {
      // Credit wallet
      const walletBefore = investment.user.wallet.balance;
      const walletAfter = walletBefore.add(returnAmount);

      await tx.wallet.update({
        where: { userId: investment.userId },
        data: { balance: walletAfter },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: investment.userId,
          type: 'INVESTMENT_LIQUIDATION',
          status: 'COMPLETED',
          amount: returnAmount,
          balanceBefore: walletBefore,
          balanceAfter: walletAfter,
          description: `Early liquidation (Penalty: Ã¢â€šÂ¦${penalty})`,
          reference: investment.id,
        },
      });

      // Mark investment as liquidated
      return tx.investment.update({
        where: { id: investment.id },
        data: { status: 'LIQUIDATED' },
      });
    });

    return result;
  }
}
