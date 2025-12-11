import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionStatus, KYCStatus, CardRequestStatus, AccountStatus, TransferCodeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../common/services/email.service';
import { CreateUserDto, UpdateUserDto, UpdateBalanceDto, UpdateKycStatusDto, AdminUpdateTransferCodeDto } from './dto/create-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async getDashboardStats() {
    // Get total users count
    const totalUsers = await this.prisma.user.count({
      where: { role: 'USER' }
    });

    // Get active users count
    const activeUsers = await this.prisma.user.count({
      where: { 
        role: 'USER',
        accountStatus: AccountStatus.ACTIVE 
      }
    });

    // Get pending KYC count
    const pendingKYC = await this.prisma.kYC.count({
      where: { status: KYCStatus.PENDING }
    });

    // Get current month transactions (excluding ADJUSTMENT type which are admin-created)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalTransactions = await this.prisma.transaction.count({
      where: {
        createdAt: { gte: startOfMonth },
        status: TransactionStatus.COMPLETED,
        type: { not: 'ADJUSTMENT' } // Exclude admin adjustments and initial deposits
      }
    });

    // Get total transaction volume for current month (excluding admin adjustments)
    const volumeResult = await this.prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: TransactionStatus.COMPLETED,
        type: { not: 'ADJUSTMENT' } // Exclude admin adjustments
      },
      _sum: {
        amount: true
      }
    });

    const totalVolume = volumeResult._sum.amount?.toNumber() || 0;

    // Get active cards count
    const activeCards = await this.prisma.card.count({
      where: { status: 'ACTIVE' }
    });

    // Get pending transfers awaiting admin approval (treat as "Pending Approvals")
    const pendingTransfers = await (this.prisma as any).transfer.count({
      where: { status: 'PENDING' }
    });

    const pendingApprovals = pendingTransfers;

    // Count system alerts (suspicious transactions, failed logins, old pending KYC)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const oldPendingKYC = await this.prisma.kYC.count({
      where: {
        status: KYCStatus.PENDING,
        createdAt: { lt: twoDaysAgo }
      }
    });

    // Count large pending transactions
    const largePendingTransactions = await this.prisma.transaction.count({
      where: {
        status: TransactionStatus.PENDING,
        amount: { gte: 1000000 } // Large transactions over 1M
      }
    });

    const systemAlerts = oldPendingKYC + largePendingTransactions;

    return {
      totalUsers,
      activeUsers,
      pendingKYC,
      totalTransactions,
      totalVolume,
      activeCards,
      pendingApprovals,
      systemAlerts
    };
  }

  async getTransactionVolume() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fetch all transactions from last 7 days in a single query
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: TransactionStatus.COMPLETED,
        type: { not: 'ADJUSTMENT' }
      },
      select: {
        createdAt: true,
        amount: true,
      }
    });

    // Group by date in memory
    const dateMap = new Map<string, { date: Date; transactions: number; volume: number }>();
    
    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap.set(dateStr, { date, transactions: 0, volume: 0 });
    }

    // Aggregate transactions by date
    transactions.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      const dateStr = txDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayData = dateMap.get(dateStr);
      if (dayData) {
        dayData.transactions++;
        dayData.volume += tx.amount.toNumber();
      }
    });

    // Convert to array
    return Array.from(dateMap.values()).map(({ date, transactions, volume }) => ({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions,
      volume
    }));
  }

  async getTransactionTypeDistribution() {
    const totalCompleted = await this.prisma.transaction.count({
      where: { status: TransactionStatus.COMPLETED }
    });

    if (totalCompleted === 0) {
      return [
        { name: 'Deposits', value: 0, color: '#10b981' },
        { name: 'Withdrawals', value: 0, color: '#f59e0b' },
        { name: 'Transfers', value: 0, color: '#3b82f6' },
        { name: 'Others', value: 0, color: '#8b5cf6' },
      ];
    }

    const deposits = await this.prisma.transaction.count({
      where: { 
        type: 'DEPOSIT',
        status: TransactionStatus.COMPLETED 
      }
    });

    const withdrawals = await this.prisma.transaction.count({
      where: { 
        type: 'WITHDRAWAL',
        status: TransactionStatus.COMPLETED 
      }
    });

    const transfers = await this.prisma.transaction.count({
      where: { 
        type: 'TRANSFER',
        status: TransactionStatus.COMPLETED 
      }
    });

    const others = totalCompleted - deposits - withdrawals - transfers;

    return [
      { 
        name: 'Deposits', 
        value: Math.round((deposits / totalCompleted) * 100), 
        color: '#10b981' 
      },
      { 
        name: 'Withdrawals', 
        value: Math.round((withdrawals / totalCompleted) * 100), 
        color: '#f59e0b' 
      },
      { 
        name: 'Transfers', 
        value: Math.round((transfers / totalCompleted) * 100), 
        color: '#3b82f6' 
      },
      { 
        name: 'Others', 
        value: Math.round((others / totalCompleted) * 100), 
        color: '#8b5cf6' 
      },
    ];
  }

  async getRecentActivities() {
    // Get recent audit logs
    const recentLogs = await this.prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return recentLogs.map(log => ({
      id: log.id,
      action: log.action,
      description: log.description || this.formatAuditAction(log.action),
      userName: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
      userEmail: log.user?.email,
      timestamp: log.createdAt,
      metadata: log.metadata
    }));
  }

  async getSystemAlerts() {
    const alerts: Array<{ id: string; type: string; title: string; message: string; timestamp: string }> = [];

    // Check for large pending transactions
    const largePendingTransactions = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PENDING,
        amount: { gte: 1000000 }
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    largePendingTransactions.forEach(tx => {
      alerts.push({
        id: tx.id,
        type: 'error',
        title: 'Large Transaction Pending',
        message: `Transaction of ${tx.amount.toNumber()} from ${tx.user.firstName} ${tx.user.lastName} requires review.`,
        timestamp: tx.createdAt.toISOString()
      });
    });

    // Check for old pending KYC
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const oldPendingKYCCount = await this.prisma.kYC.count({
      where: {
        status: KYCStatus.PENDING,
        createdAt: { lt: twoDaysAgo }
      }
    });

    if (oldPendingKYCCount > 0) {
      alerts.push({
        id: 'kyc-old-pending',
        type: 'warning',
        title: 'KYC Documents Pending',
        message: `${oldPendingKYCCount} KYC documents are awaiting review for more than 48 hours.`,
        timestamp: new Date().toISOString()
      });
    }

    // Check for suspended accounts
    const suspendedCount = await this.prisma.user.count({
      where: { 
        accountStatus: AccountStatus.SUSPENDED,
        role: 'USER'
      }
    });

    if (suspendedCount > 0) {
      alerts.push({
        id: 'suspended-accounts',
        type: 'warning',
        title: 'Suspended Accounts',
        message: `${suspendedCount} user accounts are currently suspended.`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  private formatAuditAction(action: string): string {
    return action
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // ============================================
  // USER MANAGEMENT METHODS
  // ============================================

  async createUser(createUserDto: CreateUserDto, adminId: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { phone: createUserDto.phone }
        ]
      }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate account number (10 digits)
    const accountNumber = this.generateAccountNumber();

    // Create user with wallet, KYC, and transfer codes in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          username: createUserDto.username,
          email: createUserDto.email,
          phone: createUserDto.phone,
          password: hashedPassword,
          country: createUserDto.country || 'NG',
          currency: createUserDto.currency || 'NGN',
          accountType: createUserDto.accountType || 'savings',
          transactionPin: createUserDto.transactionPin,
          accountStatus: createUserDto.accountStatus || AccountStatus.ACTIVE,
          isEmailVerified: true, // Auto-verified for admin-created accounts
          createdBy: adminId,
        },
      });

      // Create wallet
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          balance: createUserDto.initialBalance || 0,
          currency: createUserDto.currency || 'NGN',
        },
      });

      // Create KYC record
      await tx.kYC.create({
        data: {
          userId: newUser.id,
          status: createUserDto.kycStatus || KYCStatus.PENDING,
        },
      });

      // Create transfer codes (COT, IMF, TAX) - inactive by default
      const transferCodeTypes: TransferCodeType[] = ['COT', 'IMF', 'TAX'];
      for (const type of transferCodeTypes) {
        await tx.transferCode.create({
          data: {
            userId: newUser.id,
            type: type,
            code: this.generateTransferCode(type),
            amount: 0,
            isActive: false,
            isVerified: false,
          },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: adminId,
          actorEmail: 'admin',
          actorRole: 'BANK_ADMIN',
          action: 'USER_CREATED',
          entity: 'User',
          entityId: newUser.id,
          description: `Admin created user account for ${newUser.firstName} ${newUser.lastName}`,
          metadata: {
            accountNumber,
            initialBalance: createUserDto.initialBalance || 0,
          },
        },
      });

      // If initial balance > 0, create transaction
      if (createUserDto.initialBalance && createUserDto.initialBalance > 0) {
        await tx.transaction.create({
          data: {
            userId: newUser.id,
            type: 'DEPOSIT',
            status: TransactionStatus.COMPLETED,
            amount: createUserDto.initialBalance,
            currency: createUserDto.currency || 'NGN',
            balanceBefore: 0,
            balanceAfter: createUserDto.initialBalance,
            description: 'Initial deposit by admin',
            reference: `INIT-${Date.now()}-${newUser.id.substring(0, 8)}`,
          },
        });
      }

      return newUser;
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accountNumber: accountNumber,
    });

    return {
      ...user,
      accountNumber,
      message: 'User account created successfully. Welcome email sent.',
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for email/phone conflicts
    if (updateUserDto.email || updateUserDto.phone) {
      const conflict = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                updateUserDto.email ? { email: updateUserDto.email } : {},
                updateUserDto.phone ? { phone: updateUserDto.phone } : {},
              ]
            }
          ]
        }
      });

      if (conflict) {
        throw new BadRequestException('Email or phone already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        updatedBy: adminId,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        actorEmail: 'admin',
        actorRole: 'BANK_ADMIN',
        action: 'USER_UPDATED',
        entity: 'User',
        entityId: userId,
        description: `Admin updated user account for ${user.firstName} ${user.lastName}`,
        metadata: updateUserDto as any,
      },
    });

    return updatedUser;
  }

  async updateUserBalance(userId: string, updateBalanceDto: UpdateBalanceDto, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user || !user.wallet) {
      throw new NotFoundException('User or wallet not found');
    }

    const currentBalance = user.wallet.balance.toNumber();
    const newBalance = currentBalance + updateBalanceDto.amount;

    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance for this adjustment');
    }

    // Update wallet and create transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: updateBalanceDto.amount > 0 ? 'DEPOSIT' : 'WITHDRAWAL',
          status: TransactionStatus.COMPLETED,
          amount: Math.abs(updateBalanceDto.amount),
          currency: user.wallet!.currency,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: updateBalanceDto.reason || (updateBalanceDto.amount > 0 ? 'Account Credited' : 'Account Debited'),
          reference: `ADJ-${Date.now()}-${userId.substring(0, 8)}`,
          metadata: {
            adminId,
            adjustmentType: updateBalanceDto.amount > 0 ? 'CREDIT' : 'DEBIT',
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          actorEmail: 'admin',
          actorRole: 'BANK_ADMIN',
          action: 'BALANCE_ADJUSTED',
          entity: 'Wallet',
          entityId: user.wallet!.id,
          description: `Admin adjusted balance for ${user.firstName} ${user.lastName}`,
          metadata: {
            amount: updateBalanceDto.amount,
            reason: updateBalanceDto.reason,
            previousBalance: currentBalance,
            newBalance,
          },
        },
      });
    });

    return {
      success: true,
      previousBalance: currentBalance,
      newBalance,
      adjustment: updateBalanceDto.amount,
    };
  }

  async updateKycStatus(userId: string, updateKycDto: UpdateKycStatusDto, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { kyc: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.kyc) {
      throw new NotFoundException('KYC record not found');
    }

    const updatedKyc = await this.prisma.kYC.update({
      where: { userId },
      data: {
        status: updateKycDto.status,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        rejectionReason: updateKycDto.reason || null,
      },
    });

    // Create audit log
    const action = updateKycDto.status === KYCStatus.APPROVED ? 'KYC_APPROVED' : 'KYC_REJECTED';
    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        actorEmail: 'admin',
        actorRole: 'BANK_ADMIN',
        action: action,
        entity: 'KYC',
        entityId: user.kyc.id,
        description: `Admin ${updateKycDto.status.toLowerCase()} KYC for ${user.firstName} ${user.lastName}`,
        metadata: { status: updateKycDto.status, reason: updateKycDto.reason },
      },
    });

    // Send email notification
    await this.emailService.sendKycStatusEmail({
      email: user.email,
      firstName: user.firstName,
      status: updateKycDto.status,
      reason: updateKycDto.reason,
    });

    return updatedKyc;
  }

  async updateTransferCode(
    userId: string,
    codeType: TransferCodeType,
    updateCodeDto: AdminUpdateTransferCodeDto,
    adminId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const transferCode = await this.prisma.transferCode.findFirst({
      where: { userId, type: codeType },
    });

    if (!transferCode) {
      throw new NotFoundException('Transfer code not found');
    }

    const updated = await this.prisma.transferCode.update({
      where: { id: transferCode.id },
      data: {
        code: updateCodeDto.code,
        amount: updateCodeDto.amount !== undefined ? updateCodeDto.amount : transferCode.amount.toNumber(),
        isActive: updateCodeDto.isActive !== undefined ? updateCodeDto.isActive : transferCode.isActive,
        isVerified: updateCodeDto.isVerified !== undefined ? updateCodeDto.isVerified : transferCode.isVerified,
        description: updateCodeDto.description || transferCode.description,
        activatedBy: updateCodeDto.isActive ? adminId : transferCode.activatedBy,
        activatedAt: updateCodeDto.isActive ? new Date() : transferCode.activatedAt,
        verifiedBy: updateCodeDto.isVerified ? adminId : transferCode.verifiedBy,
        verifiedAt: updateCodeDto.isVerified ? new Date() : transferCode.verifiedAt,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        actorEmail: 'admin',
        actorRole: 'BANK_ADMIN',
        action: 'USER_UPDATED',
        entity: 'TransferCode',
        entityId: transferCode.id,
        description: `Admin updated ${codeType} transfer code for ${user.firstName} ${user.lastName}`,
        metadata: updateCodeDto as any,
      },
    });

    return updated;
  }

  async getTransferCodes(userId: string) {
    const codes = await this.prisma.transferCode.findMany({
      where: { userId },
      orderBy: { type: 'asc' },
    });

    return codes;
  }

  private generateAccountNumber(): string {
    // Generate a 10-digit account number
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private generateTransferCode(type: TransferCodeType): string {
    // Generate a unique transfer code
    const prefix = type.substring(0, 3).toUpperCase();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${random}`;
  }

  async getSidebarCounts() {
    // Count pending loans
    const pendingLoans = await this.prisma.loanApplication.count({
      where: { status: 'PENDING' }
    }).catch(() => 0);

    // Count pending card requests
    const pendingCardRequests = await this.prisma.cardRequest.count({
      where: { status: CardRequestStatus.PENDING }
    }).catch(() => 0);

    // Count pending KYC
    const pendingKyc = await this.prisma.kYC.count({
      where: { status: KYCStatus.PENDING }
    }).catch(() => 0);

    // Count pending transfer codes (not verified)
    const pendingTransferCodes = await this.prisma.transferCode.count({
      where: { 
        isActive: true,
        isVerified: false
      }
    }).catch(() => 0);

    // Count open support tickets
    const openSupportTickets = await this.prisma.supportTicket.count({
      where: { 
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      }
    }).catch(() => 0);

    return {
      pendingLoans,
      pendingCardRequests,
      pendingKyc,
      pendingTransferCodes,
      openSupportTickets,
    };
  }
}
