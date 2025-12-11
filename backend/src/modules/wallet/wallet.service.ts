import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DepositDto, WithdrawDto, TransferDto } from './dto/wallet.dto';
import { ExchangeRateService } from '../../common/services/exchange-rate.service';
import { TransferLimitsService } from '../../common/services/transfer-limits.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private exchangeRateService: ExchangeRateService,
    private transferLimitsService: TransferLimitsService,
  ) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async deposit(userId: string, depositDto: DepositDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get current wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const newBalance = Number(wallet.balance) + depositDto.amount;

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: depositDto.amount,
          balanceBefore: wallet.balance,
          balanceAfter: newBalance,
          description: depositDto.description || 'Deposit',
          reference: `DEP-${Date.now()}-${userId.substring(0, 8)}`,
        },
      });

      return {
        wallet: updatedWallet,
        transaction,
      };
    });
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get current wallet with user and KYC info
      const wallet = await tx.wallet.findUnique({
        where: { userId },
        include: {
          user: {
            include: { kyc: true },
          },
        },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      // Check KYC approval
      if (!wallet.user.kyc || wallet.user.kyc.status !== 'APPROVED') {
        throw new BadRequestException('KYC verification required. Please complete your KYC to withdraw funds.');
      }

      // Check sufficient balance
      if (new Decimal(wallet.balance).lessThan(withdrawDto.amount)) {
        throw new BadRequestException(
          `Insufficient balance. Available: ${wallet.balance.toString()} ${wallet.currency}, Required: ${withdrawDto.amount} ${wallet.currency}`
        );
      }

      const newBalance = Number(wallet.balance) - withdrawDto.amount;

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          amount: withdrawDto.amount,
          balanceBefore: wallet.balance,
          balanceAfter: newBalance,
          description: withdrawDto.description || 'Withdrawal',
          reference: `WTH-${Date.now()}-${userId.substring(0, 8)}`,
        },
      });

      return {
        wallet: updatedWallet,
        transaction,
      };
    });
  }

  async transfer(senderId: string, transferDto: TransferDto) {
    // Route to appropriate transfer handler based on type
    switch (transferDto.transferType) {
      case 'INTERNAL':
        return this.internalTransfer(senderId, transferDto);
      case 'DOMESTIC':
        return this.domesticTransfer(senderId, transferDto);
      case 'INTERNATIONAL':
        return this.internationalTransfer(senderId, transferDto);
      default:
        throw new BadRequestException('Invalid transfer type');
    }
  }

  private async internalTransfer(senderId: string, transferDto: TransferDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get sender wallet with user and KYC info
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderId },
        include: {
          user: {
            include: { kyc: true },
          },
        },
      });

      if (!senderWallet) {
        throw new NotFoundException('Sender wallet not found');
      }

      // Check KYC approval
      if (!senderWallet.user.kyc || senderWallet.user.kyc.status !== 'APPROVED') {
        throw new BadRequestException('KYC verification required. Please complete your KYC to transfer funds.');
      }

      // Check transfer limits
      this.transferLimitsService.checkSingleTransferLimit(transferDto.amount);
      await this.transferLimitsService.checkTransferLimits(senderId, transferDto.amount);

      // Calculate fee (0 for internal transfers)
      const fee = this.transferLimitsService.calculateFee(transferDto.amount, 'INTERNAL');
      const totalAmount = transferDto.amount + fee;

      // Check sufficient balance (amount + fee)
      if (new Decimal(senderWallet.balance).lessThan(totalAmount)) {
        throw new BadRequestException(
          `Insufficient balance. Available: ${senderWallet.balance.toString()} ${senderWallet.currency}, Required: ${totalAmount} (Amount: ${transferDto.amount} + Fee: ${fee})`
        );
      }

      if (!transferDto.recipientId) {
        throw new BadRequestException('Recipient ID is required for internal transfers');
      }

      // Get recipient wallet
      const recipientWallet = await tx.wallet.findUnique({
        where: { userId: transferDto.recipientId },
        include: { user: true },
      });

      if (!recipientWallet) {
        throw new NotFoundException('Recipient wallet not found');
      }

      // Deduct from sender (amount + fee)
      const senderNewBalance = Number(senderWallet.balance) - totalAmount;
      await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: senderNewBalance },
      });

      // Add to recipient
      const recipientNewBalance = Number(recipientWallet.balance) + transferDto.amount;
      await tx.wallet.update({
        where: { userId: transferDto.recipientId },
        data: { balance: recipientNewBalance },
      });

      // Create transfer record
      const transfer = await tx.transfer.create({
        data: {
          senderId,
          receiverId: transferDto.recipientId,
          transferType: 'INTERNAL',
          amount: transferDto.amount,
          currency: senderWallet.currency,
          description: transferDto.description,
          status: 'COMPLETED',
          providerResponse: {
            fee,
            totalAmount,
          },
        },
      });

      // Create transaction for sender
      await tx.transaction.create({
        data: {
          userId: senderId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: transferDto.amount,
          balanceBefore: senderWallet.balance,
          balanceAfter: senderNewBalance,
          description: transferDto.description || `Transfer to ${recipientWallet.user.firstName} ${recipientWallet.user.lastName}`,
          reference: `INT-${Date.now()}-${senderId.substring(0, 8)}`,
          transferId: transfer.id,
          metadata: {
            fee,
            totalAmount,
            transferType: 'INTERNAL',
          },
        },
      });

      // Create transaction for recipient
      await tx.transaction.create({
        data: {
          userId: transferDto.recipientId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: transferDto.amount,
          balanceBefore: recipientWallet.balance,
          balanceAfter: recipientNewBalance,
          description: transferDto.description || `Transfer from ${senderWallet.user.firstName} ${senderWallet.user.lastName}`,
          reference: `INT-${Date.now()}-${transferDto.recipientId.substring(0, 8)}`,
          transferId: transfer.id,
        },
      });

      return {
        transfer,
        senderNewBalance,
        recipientNewBalance,
        fee,
        totalAmount,
      };
    });
  }

  private async domesticTransfer(senderId: string, transferDto: TransferDto) {
    return this.prisma.$transaction(async (tx) => {
      // Validate required fields
      if (!transferDto.beneficiaryName || !transferDto.beneficiaryAccount || !transferDto.bankName) {
        throw new BadRequestException('Beneficiary name, account number, and bank name are required for domestic transfers');
      }

      // Get sender wallet
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderId },
        include: {
          user: {
            include: { kyc: true },
          },
        },
      });

      if (!senderWallet) {
        throw new NotFoundException('Sender wallet not found');
      }

      // Check KYC approval
      if (!senderWallet.user.kyc || senderWallet.user.kyc.status !== 'APPROVED') {
        throw new BadRequestException('KYC verification required. Please complete your KYC to transfer funds.');
      }

      // Check transfer limits
      this.transferLimitsService.checkSingleTransferLimit(transferDto.amount);
      await this.transferLimitsService.checkTransferLimits(senderId, transferDto.amount);

      // Calculate fee
      const fee = this.transferLimitsService.calculateFee(transferDto.amount, 'DOMESTIC');
      const totalAmount = transferDto.amount + fee;

      // Check sufficient balance (amount + fee)
      if (new Decimal(senderWallet.balance).lessThan(totalAmount)) {
        throw new BadRequestException(
          `Insufficient balance. Available: ${senderWallet.balance.toString()} ${senderWallet.currency}, Required: ${totalAmount} (Amount: ${transferDto.amount} + Fee: ${fee})`
        );
      }

      // Deduct from sender (amount + fee)
      const senderNewBalance = Number(senderWallet.balance) - totalAmount;
      await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: senderNewBalance },
      });

      // Create transfer record
      const transfer = await tx.transfer.create({
        data: {
          senderId,
          transferType: 'DOMESTIC',
          amount: transferDto.amount,
          currency: senderWallet.currency,
          description: transferDto.description,
          status: 'COMPLETED', // Mock: instantly completed
          beneficiaryName: transferDto.beneficiaryName,
          beneficiaryAccount: transferDto.beneficiaryAccount,
          bankName: transferDto.bankName,
          bankCode: transferDto.bankCode,
          country: transferDto.country || senderWallet.user.country,
          providerRef: `MOCK-DOM-${Date.now()}`,
          providerResponse: {
            fee,
            totalAmount,
          },
        },
      });

      // Create transaction for sender
      await tx.transaction.create({
        data: {
          userId: senderId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: transferDto.amount,
          balanceBefore: senderWallet.balance,
          balanceAfter: senderNewBalance,
          description: `Domestic transfer to ${transferDto.beneficiaryName} (${transferDto.bankName})`,
          reference: `DOM-${Date.now()}-${senderId.substring(0, 8)}`,
          transferId: transfer.id,
          metadata: {
            fee,
            totalAmount,
            transferType: 'DOMESTIC',
          },
        },
      });

      return {
        transfer,
        senderNewBalance,
        fee,
        totalAmount,
        message: 'Domestic transfer completed successfully (Mock)',
      };
    });
  }

  private async internationalTransfer(senderId: string, transferDto: TransferDto) {
    return this.prisma.$transaction(async (tx) => {
      // Validate required fields
      if (!transferDto.beneficiaryName || !transferDto.beneficiaryAccount || !transferDto.country) {
        throw new BadRequestException('Beneficiary name, account number, and country are required for international transfers');
      }

      // Get sender wallet
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderId },
        include: {
          user: {
            include: { kyc: true },
          },
        },
      });

      if (!senderWallet) {
        throw new NotFoundException('Sender wallet not found');
      }

      // Check KYC approval
      if (!senderWallet.user.kyc || senderWallet.user.kyc.status !== 'APPROVED') {
        throw new BadRequestException('KYC verification required. Please complete your KYC to transfer funds.');
      }

      // Check transfer limits
      this.transferLimitsService.checkSingleTransferLimit(transferDto.amount);
      await this.transferLimitsService.checkTransferLimits(senderId, transferDto.amount);

      // Calculate fee
      const fee = this.transferLimitsService.calculateFee(transferDto.amount, 'INTERNATIONAL');
      const totalAmount = transferDto.amount + fee;

      // Check sufficient balance (amount + fee)
      if (new Decimal(senderWallet.balance).lessThan(totalAmount)) {
        throw new BadRequestException(
          `Insufficient balance. Available: ${senderWallet.balance.toString()} ${senderWallet.currency}, Required: ${totalAmount} (Amount: ${transferDto.amount} + Fee: ${fee})`
        );
      }

      // Deduct from sender (amount + fee)
      const senderNewBalance = Number(senderWallet.balance) - totalAmount;
      await tx.wallet.update({
        where: { userId: senderId },
        data: { balance: senderNewBalance },
      });

      // Create transfer record
      const transfer = await tx.transfer.create({
        data: {
          senderId,
          transferType: 'INTERNATIONAL',
          amount: transferDto.amount,
          currency: senderWallet.currency,
          description: transferDto.description,
          status: 'COMPLETED', // Mock: instantly completed
          beneficiaryName: transferDto.beneficiaryName,
          beneficiaryAccount: transferDto.beneficiaryAccount,
          bankName: transferDto.bankName,
          swiftCode: transferDto.swiftCode,
          iban: transferDto.iban,
          country: transferDto.country,
          providerRef: `MOCK-INT-${Date.now()}`,
          providerResponse: {
            fee,
            totalAmount,
          },
        },
      });

      // Create transaction for sender
      await tx.transaction.create({
        data: {
          userId: senderId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: transferDto.amount,
          balanceBefore: senderWallet.balance,
          balanceAfter: senderNewBalance,
          description: `International transfer to ${transferDto.beneficiaryName} (${transferDto.country})`,
          reference: `INT-${Date.now()}-${senderId.substring(0, 8)}`,
          transferId: transfer.id,
          metadata: {
            fee,
            totalAmount,
            transferType: 'INTERNATIONAL',
          },
        },
      });

      return {
        transfer,
        senderNewBalance,
        fee,
        totalAmount,
        message: 'International transfer completed successfully (Mock)',
      };
    });
  }

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: {
        balance: true,
        currency: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  // Admin functions
  async adminAdjustBalance(
    userId: string,
    adminId: string,
    amount: number,
    type: 'CREDIT' | 'DEBIT',
    reason: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Get user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
        include: { user: true },
      });

      if (!wallet) {
        throw new NotFoundException('User wallet not found');
      }

      // Check if user account is active
      if (wallet.user.accountStatus === 'CLOSED') {
        throw new BadRequestException('Cannot adjust balance for closed account');
      }

      const currentBalance = Number(wallet.balance);
      let newBalance: number;
      let transactionType: string;
      let transactionAmount: number;
      let description: string;

      if (type === 'CREDIT') {
        newBalance = currentBalance + amount;
        transactionType = 'TRANSFER';
        transactionAmount = amount; // Positive for credit
        description = reason;
      } else {
        // DEBIT
        if (currentBalance < amount) {
          throw new BadRequestException(
            `Insufficient balance. Current: ${currentBalance}, Requested: ${amount}`,
          );
        }
        newBalance = currentBalance - amount;
        transactionType = 'TRANSFER';
        transactionAmount = -amount; // Negative for debit
        description = reason;
      }

      // Update wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      // Create transaction record (store reason only in metadata, not in description)
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: transactionType as any,
          status: 'COMPLETED',
          amount: transactionAmount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: type === 'CREDIT' ? 'Account Credited' : 'Account Debited',
          reference: `ADJ-${Date.now()}-${userId.substring(0, 8)}`,
          metadata: {
            adjustmentType: type,
            reason,
            adminId,
          },
        },
      });

      // Create audit log
      const admin = await tx.user.findUnique({ where: { id: adminId } });
      if (!admin) {
        throw new NotFoundException('Admin user not found');
      }
      await tx.auditLog.create({
        data: {
          userId: adminId,
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'BALANCE_ADJUSTED',
          entity: 'Wallet',
          entityId: wallet.id,
          description: `Admin ${type.toLowerCase()}ed ${amount} ${wallet.currency} for user ${wallet.user.email}. Reason: ${reason}`,
          metadata: {
            userId,
            amount,
            type,
            reason,
            previousBalance: currentBalance,
            newBalance,
          },
        },
      });

      // Create notification for user (without reason)
      await tx.notification.create({
        data: {
          userId,
          title: `Balance ${type === 'CREDIT' ? 'Credited' : 'Debited'}`,
          message: `Your account has been ${type === 'CREDIT' ? 'credited with' : 'debited by'} ${amount} ${wallet.currency}.`,
          type: type === 'CREDIT' ? 'SUCCESS' : 'WARNING',
        },
      });

      return {
        wallet: updatedWallet,
        transaction,
        previousBalance: currentBalance,
        newBalance,
      };
    });
  }

  async adminClearAccount(
    userId: string,
    adminId: string,
    reason: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Get user wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId },
        include: { user: true },
      });

      if (!wallet) {
        throw new NotFoundException('User wallet not found');
      }

      // Check if user account is active
      if (wallet.user.accountStatus === 'CLOSED') {
        throw new BadRequestException('Cannot clear balance for closed account');
      }

      const currentBalance = Number(wallet.balance);

      // Count existing transactions
      const transactionCount = await tx.transaction.count({
        where: { userId },
      });

      // Delete related records first (to avoid foreign key constraints)
      // Delete payments
      await tx.payment.deleteMany({
        where: { userId },
      });

      // Delete withdrawals
      await tx.withdrawal.deleteMany({
        where: { userId },
      });

      // Delete deposits
      await tx.deposit.deleteMany({
        where: { userId },
      });

      // Delete transfers where user was sender or receiver
      await tx.transfer.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
      });

      // Now delete all user transactions
      await tx.transaction.deleteMany({
        where: { userId },
      });

      // Update wallet to zero
      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: 0 },
      });

      // Create audit log
      const admin = await tx.user.findUnique({ where: { id: adminId } });
      if (!admin) {
        throw new NotFoundException('Admin user not found');
      }
      await tx.auditLog.create({
        data: {
          userId: adminId,
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'BALANCE_ADJUSTED',
          entity: 'Wallet',
          entityId: wallet.id,
          description: `Admin cleared account for user ${wallet.user.email}. Balance: ${currentBalance} ${wallet.currency} cleared, ${transactionCount} transactions deleted. Reason: ${reason}`,
          metadata: {
            userId,
            amount: currentBalance,
            type: 'CLEAR',
            reason,
            previousBalance: currentBalance,
            newBalance: 0,
            deletedTransactions: transactionCount,
          },
        },
      });

      return {
        wallet: updatedWallet,
        previousBalance: currentBalance,
        newBalance: 0,
        clearedAmount: currentBalance,
        deletedTransactions: transactionCount,
      };
    });
  }
}
