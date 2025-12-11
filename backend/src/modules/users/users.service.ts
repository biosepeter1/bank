import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(adminRole: string) {
    // SUPER_ADMIN can see all users (including other admins)
    // BANK_ADMIN can only see regular users (role: USER)
    const where = adminRole === 'SUPER_ADMIN' ? {} : { role: 'USER' as const };

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        phone: true,
        country: true,
        currency: true,
        accountType: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        lastLoginAt: true,
        wallet: {
          select: {
            balance: true,
            currency: true,
            updatedAt: true,
          },
        },
        kyc: {
          select: {
            status: true,
            dateOfBirth: true,
            address: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        kyc: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, updateData: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });
  }

  async updateUserStatus(userId: string, status: AccountStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: status },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountStatus: true,
      },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user and all related data (cascading delete should handle related records)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully', userId };
  }

  async adjustBalance(
    userId: string,
    type: 'credit' | 'debit',
    amount: number,
    reason?: string,
    adminId?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.wallet) {
      throw new BadRequestException('User wallet not found');
    }

    const adjustmentAmount = new Decimal(amount);

    if (type === 'debit' && user.wallet.balance.lessThan(adjustmentAmount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Perform balance adjustment in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const oldBalance = user.wallet.balance;
      const newBalance =
        type === 'credit'
          ? oldBalance.add(adjustmentAmount)
          : oldBalance.sub(adjustmentAmount);

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: 'ADJUSTMENT',
          amount: adjustmentAmount,
          currency: user.wallet.currency,
          status: 'COMPLETED',
          balanceBefore: oldBalance,
          balanceAfter: newBalance,
          description: (reason && reason.trim()) || (type === 'credit' ? 'Account Credited' : 'Account Debited'),
          reference: `ADM-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
      });

      return updatedWallet;
    });

    return {
      message: `Successfully ${type}ed ${amount} to user's account`,
      balance: result.balance.toNumber(),
    };
  }
}
