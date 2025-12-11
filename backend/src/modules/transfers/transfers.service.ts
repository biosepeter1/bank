import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTransferDto, CreateInternationalTransferDto, CreateBeneficiaryDto } from './dto/create-transfer.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { EmailService } from '@/common/services/email.service';

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService, private email: EmailService) {}

  /**
   * Initiate a local transfer between platform users
   */
  async initiateLocalTransfer(userId: string, data: CreateTransferDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, kyc: true },
    });

    if (!sender) throw new NotFoundException('Sender not found');

    // Check KYC verification
    if (!sender.kyc || sender.kyc.status !== 'APPROVED') {
      throw new BadRequestException(
        'KYC verification is required to make transfers. Please complete your KYC verification first.',
      );
    }

    const receiver = await this.prisma.user.findUnique({
      where: { email: data.recipientEmail },
      include: { wallet: true },
    });

    if (!receiver) throw new BadRequestException('Recipient not found');

    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    const amount = new Decimal(data.amount);

    if (!sender.wallet) {
      throw new BadRequestException('Sender wallet not found');
    }

    if (new Decimal(sender.wallet.balance).lessThan(amount)) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${sender.wallet.balance.toString()} ${sender.wallet.currency}, Required: ${amount.toString()} ${sender.wallet.currency}`
      );
    }

    // Database transaction for atomicity
    const result = await this.prisma.$transaction(async (tx) => {
      // Create transfer record
      const newTransfer = await tx.transfer.create({
        data: {
          senderId: userId,
          receiverId: receiver.id,
          transferType: 'INTERNAL',
          amount,
          currency: sender.wallet.currency,
          description: data.description,
          status: 'COMPLETED',
        },
      });

      const senderBalanceBefore = sender.wallet.balance;
      const senderBalanceAfter = senderBalanceBefore.sub(amount);

      // Debit sender
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: senderBalanceAfter,
        },
      });

      const receiverBalanceBefore = receiver.wallet.balance;
      const receiverBalanceAfter = receiverBalanceBefore.add(amount);

      // Credit receiver
      await tx.wallet.update({
        where: { userId: receiver.id },
        data: {
          balance: receiverBalanceAfter,
        },
      });

      // Create sender transaction record
      await tx.transaction.create({
        data: {
          userId,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount,
          balanceBefore: senderBalanceBefore,
          balanceAfter: senderBalanceAfter,
          description: `Transfer to ${receiver.firstName} ${receiver.lastName}`,
          reference: `XFER-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          transferId: newTransfer.id,
        },
      });

      // Create receiver transaction record
      await tx.transaction.create({
        data: {
          userId: receiver.id,
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount,
          balanceBefore: receiverBalanceBefore,
          balanceAfter: receiverBalanceAfter,
          description: `Transfer from ${sender.firstName} ${sender.lastName}`,
          reference: `XFER-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          transferId: newTransfer.id,
        },
      });

      return newTransfer;
    });

    // Send email notifications if enabled (non-blocking)
    try {
      // Notify sender
      if (sender.emailTransactions) {
        await this.email.sendTransactionEmail({
          email: sender.email,
          firstName: sender.firstName,
          transactionType: 'TRANSFER',
          amount: amount.toString(),
          currency: sender.wallet.currency,
          balance: sender.wallet.balance.sub(amount).toString(),
          reference: `XFER-${Date.now()}`,
          description: `Transfer to ${receiver.firstName} ${receiver.lastName}`,
        });
      }

      // Notify receiver
      if (receiver.emailTransactions) {
        await this.email.sendTransactionEmail({
          email: receiver.email,
          firstName: receiver.firstName,
          transactionType: 'TRANSFER',
          amount: amount.toString(),
          currency: receiver.wallet.currency,
          balance: receiver.wallet.balance.add(amount).toString(),
          reference: `XFER-${Date.now()}`,
          description: `Transfer from ${sender.firstName} ${sender.lastName}`,
        });
      }
    } catch (error) {
      // Log error but don't fail the transaction
      console.error('Failed to send transaction emails:', error);
    }

    return result;
  }

  /**
   * Request a local transfer (creates a pending transfer requiring admin approval)
   */
  async requestLocalTransfer(userId: string, data: CreateTransferDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, kyc: true },
    });

    if (!sender) throw new NotFoundException('Sender not found');

    // Check KYC verification
    if (!sender.kyc || sender.kyc.status !== 'APPROVED') {
      throw new BadRequestException(
        'KYC verification is required to request transfers. Please complete your KYC verification first.',
      );
    }

    // Find recipient by email OR phone (used as account number) OR id
    let receiver;
    if (data.recipientEmail) {
      receiver = await this.prisma.user.findUnique({
        where: { email: data.recipientEmail },
        include: { wallet: true },
      });
    } else if (data.recipientAccount) {
      // Try to find by phone (account number) or id
      receiver = await this.prisma.user.findFirst({
        where: {
          OR: [
            { phone: data.recipientAccount },
            { id: data.recipientAccount },
          ],
        },
        include: { wallet: true },
      });
    }

    if (!receiver) {
      throw new BadRequestException(
        `Recipient not found. Searched for: ${data.recipientEmail || data.recipientAccount || 'no identifier provided'}`,
      );
    }

    if (!sender.wallet) {
      throw new BadRequestException('Sender wallet not found');
    }

    const amount = new Decimal(data.amount);

    if (new Decimal(sender.wallet.balance).lessThan(amount)) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${sender.wallet.balance.toString()} ${sender.wallet.currency}, Required: ${amount.toString()} ${sender.wallet.currency}`
      );
    }

    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    const newTransfer = await this.prisma.transfer.create({
      data: {
        senderId: userId,
        receiverId: receiver.id,
        transferType: 'INTERNAL',
        amount,
        currency: sender.wallet.currency,
        description: data.description,
        status: 'PENDING',
      },
    });

    // Log a pending transaction for the sender so they can see the request in history
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'TRANSFER',
        status: 'PENDING',
        amount,
        currency: sender.wallet.currency,
        balanceBefore: sender.wallet.balance,
        balanceAfter: sender.wallet.balance, // no funds moved yet
        description: `Transfer request to ${receiver.firstName} ${receiver.lastName}`,
        reference: `TRF-${newTransfer.id.substring(0, 8)}-P`,
        transferId: newTransfer.id,
      },
    });

    return newTransfer;
  }

  /**
   * Initiate an international transfer
   */
  async initiateInternationalTransfer(userId: string, data: CreateInternationalTransferDto) {
    // Check system setting to require transfer codes (COT/IMF/TAX)
    // Robust, case-insensitive detection of any setting enabling transfer codes
    const settings = await (this.prisma as any).systemSetting.findMany({
      where: { key: { contains: 'transfer', mode: 'insensitive' } },
      select: { key: true, value: true },
    });
    // Per-user forced override
    const forcedSetting = await (this.prisma as any).systemSetting.findUnique({ where: { key: `transferCodes.force.${userId}` } });

    const truthy = (v: any) => typeof v === 'string'
      ? ['true', '1', 'yes', 'on', 'enabled', 'enable', 'active'].includes(v.toLowerCase())
      : !!v;

    const codesRequired = (Array.isArray(settings)
      ? settings.some((s: any) => /codes?/i.test(s.key) && truthy(s.value))
      : false) || !!(forcedSetting && truthy(forcedSetting.value));

    // Validate transfer codes if provided or required by settings
    if (data.transferCodes && data.transferCodes.length > 0) {
      const validCodes = await this.validateTransferCodes(userId, data.transferCodes);
      if (!validCodes) {
        throw new BadRequestException('Invalid or inactive transfer codes');
      }
    } else if (codesRequired) {
      // If codes not provided, allow if user already has all verified codes stored
      const existing = await this.prisma.transferCode.findMany({
        where: { userId, isActive: true, isVerified: true },
        select: { type: true },
      });
      const types = new Set(existing.map((e: any) => e.type));
      const hasAll = types.has('COT') && types.has('IMF') && types.has('TAX');
      if (!hasAll) {
        throw new BadRequestException('Transfer codes required (COT, IMF, TAX)');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true, kyc: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // Check KYC verification
    if (!user.kyc || user.kyc.status !== 'APPROVED') {
      throw new BadRequestException(
        'KYC verification is required to make international transfers. Please complete your KYC verification first.',
      );
    }

    const amount = new Decimal(data.amount);

    // Check if user has sufficient balance
    if (new Decimal(user.wallet.balance).lessThan(amount)) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${user.wallet.balance.toString()} ${user.wallet.currency}, Required: ${amount.toString()} ${data.currency || user.wallet.currency}`
      );
    }

    // Create international transfer (pending status for processing)
    const transfer = await this.prisma.transfer.create({
      data: {
        senderId: userId,
        transferType: 'INTERNATIONAL',
        amount,
        currency: data.currency || user.wallet.currency,
        description: data.description,
        status: 'PENDING',
        beneficiaryName: data.beneficiaryName,
        beneficiaryAccount: data.beneficiaryAccount,
        bankName: data.bankName,
        bankCode: data.bankCode,
        swiftCode: data.swiftCode,
        country: data.country,
      },
    });

    // Log a pending transaction so the user sees it immediately
    await this.prisma.transaction.create({
      data: {
        userId,
        type: 'TRANSFER',
        status: 'PENDING',
        amount,
        currency: data.currency || user.wallet.currency,
        balanceBefore: user.wallet.balance,
        balanceAfter: user.wallet.balance,
        description: `International transfer request${data.beneficiaryName ? ` to ${data.beneficiaryName}` : ''}`,
        reference: `TRF-${transfer.id.substring(0, 8)}-P`,
        transferId: transfer.id,
      },
    });

    // Send email notification to user about pending transfer
    try {
      if (user.emailTransactions) {
        await this.email.sendTransactionEmail({
          email: user.email,
          firstName: user.firstName,
          transactionType: 'TRANSFER',
          amount: amount.toString(),
          currency: data.currency || user.wallet.currency,
          balance: user.wallet.balance.toString(),
          reference: `TRF-${transfer.id.substring(0, 8)}-P`,
          description: `International wire transfer to ${data.beneficiaryName} - Processing`,
        });
      }
    } catch (error) {
      console.error('Failed to send international transfer pending email:', error);
    }

    return transfer;
  }

  /**
   * Validate transfer codes (COT, IMF, TAX)
   */
  async validateTransferCodes(userId: string, codes: string[]): Promise<boolean> {
    const validCodes = await this.prisma.transferCode.findMany({
      where: {
        userId,
        code: { in: codes },
        isActive: true,
        isVerified: true,
      },
    });

    return validCodes.length === codes.length;
  }

  /**
   * Get all beneficiaries for a user
   */
  async getBeneficiaries(userId: string) {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Create a new beneficiary
   */
  async createBeneficiary(userId: string, data: CreateBeneficiaryDto) {
    // Check if beneficiary already exists
    const existing = await this.prisma.beneficiary.findUnique({
      where: {
        userId_accountNumber: {
          userId,
          accountNumber: data.accountNumber,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Beneficiary already exists');
    }

    return this.prisma.beneficiary.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  /**
   * Update a beneficiary
   */
  async updateBeneficiary(userId: string, beneficiaryId: string, data: Partial<CreateBeneficiaryDto>) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (!beneficiary || beneficiary.userId !== userId) {
      throw new BadRequestException('Beneficiary not found or unauthorized');
    }

    return this.prisma.beneficiary.update({
      where: { id: beneficiaryId },
      data,
    });
  }

  /**
   * Delete a beneficiary
   */
  async deleteBeneficiary(userId: string, beneficiaryId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (!beneficiary || beneficiary.userId !== userId) {
      throw new BadRequestException('Beneficiary not found or unauthorized');
    }

    return this.prisma.beneficiary.delete({
      where: { id: beneficiaryId },
    });
  }

  /**
   * Set a beneficiary as default
   */
  async setDefaultBeneficiary(userId: string, beneficiaryId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
    });

    if (!beneficiary || beneficiary.userId !== userId) {
      throw new BadRequestException('Beneficiary not found or unauthorized');
    }

    // Remove default from all other beneficiaries
    await this.prisma.beneficiary.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set this one as default
    return this.prisma.beneficiary.update({
      where: { id: beneficiaryId },
      data: { isDefault: true },
    });
  }

  /**
   * Get transfer history
   */
  async getTransferHistory(userId: string, limit: number = 10, skip: number = 0) {
    return this.prisma.transfer.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        receiver: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Admin: Get all transfers
   */
  async getAllTransfers() {
    const transfers = await this.prisma.transfer.findMany({
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
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

    return transfers.map(transfer => ({
      id: transfer.id,
      senderId: transfer.senderId,
      senderName: `${transfer.sender.firstName} ${transfer.sender.lastName}`,
      senderEmail: transfer.sender.email,
      receiverId: transfer.receiverId,
      receiverName: transfer.receiver ? `${transfer.receiver.firstName} ${transfer.receiver.lastName}` : 'N/A',
      receiverEmail: transfer.receiver?.email || 'N/A',
      amount: transfer.amount.toNumber(),
      currency: transfer.currency,
      transferType: transfer.transferType,
      status: transfer.status,
      reference: `TRF-${transfer.id.substring(0, 8)}`,
      description: transfer.description,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    }));
  }

  /**
   * Admin: Approve transfer
   */
  async approveTransfer(transferId: string, adminId: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        sender: { include: { wallet: true } },
        receiver: { include: { wallet: true } },
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new BadRequestException('Transfer already processed');
    }

    // Perform approval atomically and ensure unique references per transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Mark transfer completed
      const updatedTransfer = await tx.transfer.update({
        where: { id: transferId },
        data: { status: 'COMPLETED' },
      });

      // Fetch wallets fresh within transaction
      const senderWallet = await tx.wallet.findUnique({ where: { userId: transfer.senderId } });
      const senderBalanceBefore = senderWallet.balance;
      const senderWalletAfter = await tx.wallet.update({
        where: { userId: transfer.senderId },
        data: { balance: { decrement: transfer.amount } },
      });

      let receiverWalletAfter: any = null;
      let receiverBalanceBefore: any = null;
      if (transfer.receiverId && transfer.receiver) {
        const receiverWallet = await tx.wallet.findUnique({ where: { userId: transfer.receiverId } });
        receiverBalanceBefore = receiverWallet.balance;
        receiverWalletAfter = await tx.wallet.update({
          where: { userId: transfer.receiverId },
          data: { balance: { increment: transfer.amount } },
        });
      }

      const baseRef = `TRF-${transfer.id.substring(0, 8)}`;
      const senderRef = `${baseRef}-S`;
      const receiverRef = `${baseRef}-R`;

      // If a pending sender transaction exists for this transfer, update it; else create new
      const pendingTx = await tx.transaction.findFirst({
        where: { transferId: transfer.id, userId: transfer.senderId, type: 'TRANSFER', status: 'PENDING' },
      });
      if (pendingTx) {
        await tx.transaction.update({
          where: { id: pendingTx.id },
          data: {
            status: 'COMPLETED',
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderWalletAfter.balance,
            description: `Transfer to ${transfer.receiver?.firstName || 'external'} ${transfer.receiver?.lastName || ''}`.trim(),
            reference: senderRef,
          },
        });
      } else {
        await tx.transaction.create({
          data: {
            userId: transfer.senderId,
            type: 'TRANSFER',
            amount: transfer.amount,
            currency: transfer.currency,
            balanceBefore: senderBalanceBefore,
            balanceAfter: senderWalletAfter.balance,
            status: 'COMPLETED',
            description: `Transfer to ${transfer.receiver?.firstName || 'external'} ${transfer.receiver?.lastName || ''}`.trim(),
            reference: senderRef,
            transferId: transfer.id,
          },
        });
      }

      if (transfer.receiverId && receiverWalletAfter) {
        await tx.transaction.create({
          data: {
            userId: transfer.receiverId,
            type: 'TRANSFER',
            amount: transfer.amount,
            currency: transfer.currency,
            balanceBefore: receiverBalanceBefore,
            balanceAfter: receiverWalletAfter.balance,
            status: 'COMPLETED',
            description: `Transfer from ${transfer.sender.firstName} ${transfer.sender.lastName}`,
            reference: receiverRef,
            transferId: transfer.id,
          },
        });
      }

      return updatedTransfer;
    });

    // Send email notification to sender about approved transfer
    try {
      if (transfer.sender.emailTransactions) {
        const newBalance = transfer.sender.wallet.balance.sub(transfer.amount);
        await this.email.sendTransactionEmail({
          email: transfer.sender.email,
          firstName: transfer.sender.firstName,
          transactionType: 'TRANSFER',
          amount: transfer.amount.toString(),
          currency: transfer.currency,
          balance: newBalance.toString(),
          reference: `TRF-${transfer.id.substring(0, 8)}-S`,
          description: `International wire transfer to ${transfer.beneficiaryName || 'external'} - Completed successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to send transfer approval email:', error);
    }

    // Optionally emit audit log asynchronously here
    return result;
  }

  /**
   * Admin: Reject transfer
   */
  async rejectTransfer(transferId: string, adminId: string, reason?: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        sender: { include: { wallet: true } },
        receiver: true,
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    if (transfer.status !== 'PENDING') {
      throw new BadRequestException('Transfer already processed');
    }

    // Mark transfer failed
    const updatedTransfer = await this.prisma.transfer.update({
      where: { id: transferId },
      data: { status: 'FAILED' },
    });

    // Update existing pending transaction for the sender to FAILED, or create one if missing
    const pendingTx = await this.prisma.transaction.findFirst({
      where: { transferId: transferId, userId: transfer.senderId, type: 'TRANSFER', status: 'PENDING' },
    });

    if (pendingTx) {
      await this.prisma.transaction.update({
        where: { id: pendingTx.id },
        data: {
          status: 'FAILED',
          balanceBefore: transfer.sender.wallet?.balance,
          balanceAfter: transfer.sender.wallet?.balance, // no funds moved
          description: `Transfer request rejected${reason ? `: ${reason}` : ''}`,
          reference: `TRF-${transfer.id.substring(0, 8)}-RJ`,
        },
      });
    } else {
      // Log a failed transfer entry so the user sees it in history
      await this.prisma.transaction.create({
        data: {
          userId: transfer.senderId,
          type: 'TRANSFER',
          status: 'FAILED',
          amount: transfer.amount,
          currency: transfer.currency,
          balanceBefore: transfer.sender.wallet?.balance,
          balanceAfter: transfer.sender.wallet?.balance,
          description: `Transfer rejected by admin${reason ? `: ${reason}` : ''}`,
          reference: `TRF-${transfer.id.substring(0, 8)}-RJ`,
          transferId: transfer.id,
        },
      });
    }

    // Notify sender
    await (this.prisma as any).notification.create({
      data: {
        userId: transfer.senderId,
        title: 'Transfer Rejected',
        message: `Your transfer of ${transfer.amount.toNumber ? transfer.amount.toNumber() : transfer.amount} ${transfer.currency} was rejected${reason ? `: ${reason}` : ''}.`,
        type: 'ERROR',
      },
    }).catch(() => {});

    return updatedTransfer;
  }

  /**
   * Delete transfer (User can delete their own transfer history)
   */
  async deleteTransfer(userId: string, transferId: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id: transferId },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    if (transfer.senderId !== userId && transfer.receiverId !== userId) {
      throw new BadRequestException('You can only delete your own transfers');
    }

    // Only allow deletion of failed or completed transfers
    if (transfer.status === 'PENDING' || transfer.status === 'PROCESSING') {
      throw new BadRequestException('Cannot delete pending or processing transfers');
    }

    await this.prisma.transfer.delete({
      where: { id: transferId },
    });

    return { message: 'Transfer deleted successfully' };
  }

  /**
   * Admin: Delete transfer (Admins can delete any transfer)
   */
  async adminDeleteTransfer(transferId: string, adminId: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }

    await this.prisma.transfer.delete({
      where: { id: transferId },
    });

    // Create audit log
    // await this.prisma.auditLog.create({
    //   data: {
    //     userId: adminId,
    //     action: 'DELETE',
    //     entity: 'Transfer',
    //     entityId: transferId,
    //     details: `Deleted transfer of ${transfer.amount} ${transfer.currency} from ${transfer.sender.email} to ${transfer.receiver?.email || 'external'}`,
    //   },
    // });

    return { message: 'Transfer deleted successfully' };
  }

  /**
   * User: Request a transfer code (COT/IMF/TAX)
   */
  async requestTransferCode(userId: string, type: 'COT' | 'IMF' | 'TAX') {
    // Upsert placeholder record flagged as not verified
    const codeRec = await this.prisma.transferCode.upsert({
      where: { userId_type: { userId, type } as any },
      update: { isActive: false, isVerified: false },
      create: {
        userId,
        type: type as any,
        code: 'PENDING',
        amount: new Decimal(0),
        isActive: false,
        isVerified: false,
      },
    } as any);
    // Optionally notify admins via audit or notifications (omitted here)
    return { requested: true };
  }

  /**
   * User: Verify a transfer code issued by admin
   */
  async verifyUserTransferCode(userId: string, type: 'COT' | 'IMF' | 'TAX', code: string) {
    const rec = await this.prisma.transferCode.findUnique({
      where: { userId_type: { userId, type } as any },
    } as any);
    
    // Better error messages for debugging
    if (!rec) {
      throw new BadRequestException(`No ${type} code found. Please request one first.`);
    }
    if (!rec.isActive) {
      throw new BadRequestException(`${type} code not activated yet. Please wait for admin approval.`);
    }
    
    // Trim and uppercase both codes for comparison
    const storedCode = rec.code.trim().toUpperCase();
    const providedCode = code.trim().toUpperCase();
    
    // Normalize common confusable characters: O->0, I->1, l->1
    const normalizeCode = (c: string) => c.replace(/O/g, '0').replace(/[Il]/g, '1');
    const normalizedStored = normalizeCode(storedCode);
    const normalizedProvided = normalizeCode(providedCode);
    
    if (normalizedStored !== normalizedProvided) {
      throw new BadRequestException(`Invalid ${type} code. Expected: "${storedCode}" (length: ${storedCode.length}), Got: "${providedCode}" (length: ${providedCode.length}). Please check carefully - use number 0 not letter O.`);
    }
    
    await this.prisma.transferCode.update({
      where: { userId_type: { userId, type } as any },
      data: { isVerified: true, verifiedBy: userId, verifiedAt: new Date() },
    } as any);
    return { verified: true, success: true };
  }

  /**
   * Admin: Approve and issue a transfer code to user via email
   */
  async adminApproveAndIssueTransferCode(targetUserId: string, type: 'COT' | 'IMF' | 'TAX', adminId: string) {
    // Generate code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Upsert record
    const rec = await this.prisma.transferCode.upsert({
      where: { userId_type: { userId: targetUserId, type } as any },
      update: { code, isActive: true, isVerified: false, activatedBy: adminId, activatedAt: new Date() },
      create: {
        userId: targetUserId,
        type: type as any,
        code,
        amount: new Decimal(0),
        isActive: true,
        isVerified: false,
        activatedBy: adminId,
        activatedAt: new Date(),
      },
    } as any);

    // Email the code to the user
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    try {
      await (this as any).email?.sendTransferCodeEmail?.({
        email: user?.email,
        firstName: user?.firstName || 'Customer',
        type,
        code,
      });
    } catch (_) {}

    return { issued: true };
  }

  /**
   * Codes status for current user and whether codes are required
   */
  async getUserTransferCodeStatus(userId: string) {
    // Same detection as initiateInternationalTransfer
    const settings = await (this.prisma as any).systemSetting.findMany({
      where: { key: { contains: 'transfer', mode: 'insensitive' } },
      select: { key: true, value: true },
    });
    const truthy = (v: any) => typeof v === 'string'
      ? ['true', '1', 'yes', 'on', 'enabled', 'enable', 'active'].includes(v.toLowerCase())
      : !!v;
    const codesRequired = Array.isArray(settings)
      ? settings.some((s: any) => /codes?/i.test(s.key) && truthy(s.value))
      : false;

    const codes = await this.prisma.transferCode.findMany({
      where: { userId },
      select: { type: true, isActive: true, isVerified: true },
    });

    const byType = { COT: { isActive: false, isVerified: false }, IMF: { isActive: false, isVerified: false }, TAX: { isActive: false, isVerified: false } };
    codes.forEach((c: any) => { byType[c.type] = { isActive: c.isActive, isVerified: c.isVerified }; });

    return { transferCodesRequired: codesRequired, codes: byType };
  }

  /**
   * Admin: List pending transfer code requests
   */
  async getPendingTransferCodeRequests() {
    const rows = await this.prisma.transferCode.findMany({
      where: { isActive: false, isVerified: false },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    } as any);
    return rows.map((r: any) => ({
      userId: r.userId,
      userEmail: r.user?.email,
      userName: `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim(),
      type: r.type,
      requestedAt: r.createdAt,
    }));
  }

  /**
   * Admin: Get a user's codes and forced flag
   */
  async adminGetUserCodes(userId: string) {
    const codes = await this.prisma.transferCode.findMany({
      where: { userId },
      select: { type: true, code: true, isActive: true, isVerified: true, activatedAt: true, verifiedAt: true },
    } as any);
    const force = await (this.prisma as any).systemSetting.findUnique({ where: { key: `transferCodes.force.${userId}` } });
    return { forced: !!(force && (force.value === 'true' || force.value === '1')), codes };
  }

  /**
   * Admin: Set or clear per-user force-verification override
   */
  async adminSetUserCodesForce(userId: string, forced: boolean) {
    await (this.prisma as any).systemSetting.upsert({
      where: { key: `transferCodes.force.${userId}` },
      update: { value: forced ? 'true' : 'false' },
      create: { key: `transferCodes.force.${userId}`, value: forced ? 'true' : 'false', description: 'Per-user transfer codes force flag' },
    });
    return { forced };
  }
}
