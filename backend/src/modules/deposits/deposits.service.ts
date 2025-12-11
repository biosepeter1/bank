import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { EmailService } from '@/common/services/email.service';

@Injectable()
export class DepositsService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  /**
   * Initiate a deposit
   */
  async initiateDeposit(userId: string, data: CreateDepositDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const amount = new Decimal(data.amount);
    const currency = data.currency || user.currency || 'NGN';

    // Create deposit record
    const deposit = await this.prisma.deposit.create({
      data: {
        userId,
        amount,
        currency,
        depositMethod: data.method,
        paymentProvider: data.method === 'PAYSTACK' ? 'PAYSTACK' : 'MANUAL',
        status: 'PENDING',
      },
    });

    // For manual deposits, create a PENDING transaction so user sees it in history
    if (deposit.paymentProvider !== 'PAYSTACK') {
      const tx = await this.prisma.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          status: 'PENDING',
          amount,
          currency,
          balanceBefore: user!.wallet!.balance,
          balanceAfter: user!.wallet!.balance,
          description: `Deposit initiated via ${deposit.depositMethod}`,
          reference: `DEP-${deposit.id.substring(0, 8)}-P`,
        },
      });
      await this.prisma.deposit.update({
        where: { id: deposit.id },
        data: { transactionId: tx.id },
      });
    }

    return deposit;
  }

  /**
   * Confirm Paystack deposit
   */
  async confirmPaystackDeposit(reference: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { reference },
      include: { user: { include: { wallet: true } } },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Payment already processed');
    }

    // Update payment and wallet in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { reference },
        data: {
          status: 'SUCCESS',
          completedAt: new Date(),
        },
      });

      // Update wallet balance
      const walletBefore = payment.user.wallet;
      const walletAfter = walletBefore.balance.add(payment.amount);

      await tx.wallet.update({
        where: { userId: payment.userId },
        data: { balance: walletAfter },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_GATEWAY_DEPOSIT',
          status: 'COMPLETED',
          amount: payment.amount,
          currency: payment.currency,
          balanceBefore: walletBefore.balance,
          balanceAfter: walletAfter,
          description: `Deposit via ${payment.provider}`,
          reference: `DEP-${reference}`,
        },
      });

      return updatedPayment;
    });

    // Send email notification if enabled (non-blocking)
    try {
      if (payment.user.emailTransactions) {
        const walletAfter = payment.user.wallet.balance.add(payment.amount);
        await this.email.sendTransactionEmail({
          email: payment.user.email,
          firstName: payment.user.firstName,
          transactionType: 'DEPOSIT',
          amount: payment.amount.toString(),
          currency: payment.currency,
          balance: walletAfter.toString(),
          reference: `DEP-${reference}`,
          description: `Deposit via ${payment.provider}`,
        });
      }
    } catch (error) {
      console.error('Failed to send deposit email:', error);
    }

    return result;
  }

  /**
   * Get deposit history
   */
  async getDepositHistory(userId: string, limit = 50, skip = 0) {
    return this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    });
  }

  /**
   * Get deposit by ID
   */
  async getDepositById(userId: string, depositId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit || deposit.userId !== userId) {
      throw new NotFoundException('Deposit not found or unauthorized');
    }

    return deposit;
  }

  /**
   * Upload deposit proof
   */
  async uploadDepositProof(userId: string, depositId: string, file: any) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit || deposit.userId !== userId) {
      throw new NotFoundException('Deposit not found or unauthorized');
    }

    if (deposit.status !== 'PENDING') {
      throw new BadRequestException('Deposit already processed');
    }

    // In a real app, upload file to cloud storage (S3, Cloudinary, etc.)
    const proofUrl = `/uploads/deposits/${file.filename}`;

    return this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        proofUrl,
        status: 'PROCESSING',
      },
    });
  }

  /**
   * Admin: Get all deposits
   */
  async getAllDeposits() {
    const deposits = await this.prisma.deposit.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return deposits.map(deposit => ({
      id: deposit.id,
      userId: deposit.userId,
      userName: `${deposit.user.firstName} ${deposit.user.lastName}`,
      userEmail: deposit.user.email,
      amount: deposit.amount.toNumber(),
      currency: deposit.currency,
      method: deposit.depositMethod,
      status: deposit.status,
      proofUrl: deposit.proofUrl,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt,
    }));
  }

  /**
   * Admin: Approve deposit
   */
  async approveDeposit(depositId: string, adminId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: { include: { wallet: true } } },
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (deposit.status !== 'PENDING' && deposit.status !== 'PROCESSING') {
      throw new BadRequestException('Deposit already processed');
    }

    // Compute balances
    const balanceBefore = deposit.user.wallet?.balance ?? new Decimal(0);
    const balanceAfter = balanceBefore.add(deposit.amount);

    // Update deposit status
    const updatedDeposit = await this.prisma.deposit.update({
      where: { id: depositId },
      data: { status: 'COMPLETED' },
    });

    // Credit user wallet
    await this.prisma.wallet.update({
      where: { userId: deposit.userId },
      data: {
        balance: balanceAfter,
      },
    });

    // Update existing pending tx to COMPLETED or create one
    if (deposit.transactionId) {
      await this.prisma.transaction.update({
        where: { id: deposit.transactionId },
        data: {
          status: 'COMPLETED',
          balanceBefore,
          balanceAfter,
          description: `Deposit via ${deposit.depositMethod}`,
          reference: `DEP-${deposit.id.substring(0, 8)}`,
        },
      });
    } else {
      const tx = await this.prisma.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: deposit.amount,
          currency: deposit.currency,
          balanceBefore,
          balanceAfter,
          description: `Deposit via ${deposit.depositMethod}`,
          reference: `DEP-${deposit.id.substring(0, 8)}`,
        },
      });
      await this.prisma.deposit.update({ where: { id: deposit.id }, data: { transactionId: tx.id } });
    }

    // Create audit log
    // await this.prisma.auditLog.create({
    //   data: {
    //     userId: adminId,
    //     action: 'UPDATE',
    //     entity: 'Deposit',
    //     entityId: depositId,
    //     details: `Approved deposit of ${deposit.amount} ${deposit.currency} for user ${deposit.user.email}`,
    //   },
    // });

    return updatedDeposit;
  }

  /**
   * Admin: Reject deposit
   */
  async rejectDeposit(depositId: string, adminId: string, reason?: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (deposit.status !== 'PENDING' && deposit.status !== 'PROCESSING') {
      throw new BadRequestException('Deposit already processed');
    }

    // Update deposit status
    const updatedDeposit = await this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        status: 'FAILED',
        // Store rejection reason in a custom field if needed
      },
    });

    // Update any pending transaction to FAILED or create one so it shows in history
    if (deposit.transactionId) {
      await this.prisma.transaction.update({
        where: { id: deposit.transactionId },
        data: {
          status: 'FAILED',
          description: `Deposit rejected${reason ? `: ${reason}` : ''}`,
          reference: `DEP-${deposit.id.substring(0, 8)}-RJ`,
        },
      });
    } else {
      await this.prisma.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT',
          status: 'FAILED',
          amount: deposit.amount,
          currency: deposit.currency,
          balanceBefore: new Decimal(0), // unknown; will not affect balances
          balanceAfter: new Decimal(0),
          description: `Deposit rejected${reason ? `: ${reason}` : ''}`,
          reference: `DEP-${deposit.id.substring(0, 8)}-RJ`,
        },
      });
    }

    // Create audit log
    // await this.prisma.auditLog.create({
    //   data: {
    //     userId: adminId,
    //     action: 'UPDATE',
    //     entity: 'Deposit',
    //     entityId: depositId,
    //     details: `Rejected deposit of ${deposit.amount} ${deposit.currency} for user ${deposit.user.email}. Reason: ${reason || 'No reason provided'}`,
    //   },
    // });

    return updatedDeposit;
  }

  /**
   * Delete deposit (User can delete their own deposit history)
   */
  async deleteDeposit(userId: string, depositId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (deposit.userId !== userId) {
      throw new BadRequestException('You can only delete your own deposits');
    }

    // Only allow deletion of failed or completed deposits
    if (deposit.status === 'PENDING' || deposit.status === 'PROCESSING') {
      throw new BadRequestException('Cannot delete pending or processing deposits');
    }

    await this.prisma.deposit.delete({
      where: { id: depositId },
    });

    return { message: 'Deposit deleted successfully' };
  }

  /**
   * Admin: Delete deposit (Admins can delete any deposit)
   */
  async adminDeleteDeposit(depositId: string, adminId: string) {
    const deposit = await this.prisma.deposit.findUnique({
      where: { id: depositId },
      include: { user: true },
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    await this.prisma.deposit.delete({
      where: { id: depositId },
    });

    // Create audit log
    // await this.prisma.auditLog.create({
    //   data: {
    //     userId: adminId,
    //     action: 'DELETE',
    //     entity: 'Deposit',
    //     entityId: depositId,
    //     details: `Deleted deposit of ${deposit.amount} ${deposit.currency} for user ${deposit.user.email}`,
    //   },
    // });

    return { message: 'Deposit deleted successfully' };
  }
}
