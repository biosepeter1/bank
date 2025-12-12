"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WithdrawalsService", {
    enumerable: true,
    get: function() {
        return WithdrawalsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _library = require("@prisma/client/runtime/library");
const _emailservice = require("../../common/services/email.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WithdrawalsService = class WithdrawalsService {
    /**
   * Initiate a withdrawal request
   */ async initiateWithdrawal(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                wallet: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        const amount = new _library.Decimal(data.amount);
        // Check balance
        if (user.wallet.balance.lessThan(amount)) {
            throw new _common.BadRequestException('Insufficient balance for withdrawal');
        }
        // Calculate fees
        const fee = this.calculateWithdrawalFee(amount, data.withdrawalMethod);
        const totalDebit = amount.add(fee);
        // Check if total debit exceeds balance
        if (user.wallet.balance.lessThan(totalDebit)) {
            throw new _common.BadRequestException('Insufficient balance including withdrawal fee');
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
                reference: `WD-${Date.now()}-${userId.slice(0, 8)}`
            }
        });
        return withdrawal;
    }
    /**
   * Calculate withdrawal fee based on method and amount
   */ calculateWithdrawalFee(amount, method) {
        // Example fee structure
        const feePercentage = method === 'BANK_TRANSFER' ? 0.0075 : 0.01; // 0.75% or 1%
        const fee = amount.mul(new _library.Decimal(feePercentage));
        const minFee = new _library.Decimal(50);
        const maxFee = new _library.Decimal(500);
        if (fee.lessThan(minFee)) return minFee;
        if (fee.greaterThan(maxFee)) return maxFee;
        return fee;
    }
    /**
   * Approve a withdrawal request
   */ async approveWithdrawal(withdrawalId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({
            where: {
                id: withdrawalId
            },
            include: {
                user: {
                    include: {
                        wallet: true
                    }
                }
            }
        });
        if (!withdrawal) {
            throw new _common.NotFoundException('Withdrawal not found');
        }
        if (withdrawal.status !== 'PENDING') {
            throw new _common.BadRequestException('Withdrawal can only be approved if pending');
        }
        const result = await this.prisma.$transaction(async (tx)=>{
            // Debit wallet
            const walletBefore = withdrawal.user.wallet;
            const walletAfter = walletBefore.balance.sub(withdrawal.totalAmount);
            await tx.wallet.update({
                where: {
                    userId: withdrawal.userId
                },
                data: {
                    balance: walletAfter
                }
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
                    reference: withdrawal.id
                }
            });
            // Update withdrawal status
            const updatedWithdrawal = await tx.withdrawal.update({
                where: {
                    id: withdrawalId
                },
                data: {
                    status: 'SUCCESS',
                    processedAt: new Date()
                }
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
                    description: `Withdrawal - ${withdrawal.description}`
                });
            }
        } catch (error) {
            console.error('Failed to send withdrawal email:', error);
        }
        return result;
    }
    /**
   * Reject a withdrawal request
   */ async rejectWithdrawal(withdrawalId, reason) {
        const withdrawal = await this.prisma.withdrawal.findUnique({
            where: {
                id: withdrawalId
            }
        });
        if (!withdrawal) {
            throw new _common.NotFoundException('Withdrawal not found');
        }
        if (withdrawal.status !== 'PENDING') {
            throw new _common.BadRequestException('Only pending withdrawals can be rejected');
        }
        return this.prisma.withdrawal.update({
            where: {
                id: withdrawalId
            },
            data: {
                status: 'FAILED',
                failureReason: reason,
                processedAt: new Date()
            }
        });
    }
    /**
   * Get withdrawal history
   */ async getWithdrawalHistory(userId, limit = 20, skip = 0) {
        return this.prisma.withdrawal.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip
        });
    }
    /**
   * Get withdrawal details
   */ async getWithdrawalById(userId, withdrawalId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({
            where: {
                id: withdrawalId
            }
        });
        if (!withdrawal || withdrawal.userId !== userId) {
            throw new _common.NotFoundException('Withdrawal not found or unauthorized');
        }
        return withdrawal;
    }
    /**
   * Cancel a withdrawal request
   */ async cancelWithdrawal(userId, withdrawalId) {
        const withdrawal = await this.prisma.withdrawal.findUnique({
            where: {
                id: withdrawalId
            }
        });
        if (!withdrawal || withdrawal.userId !== userId) {
            throw new _common.NotFoundException('Withdrawal not found or unauthorized');
        }
        if (withdrawal.status !== 'PENDING') {
            throw new _common.BadRequestException('Only pending withdrawals can be cancelled');
        }
        return this.prisma.withdrawal.update({
            where: {
                id: withdrawalId
            },
            data: {
                status: 'CANCELLED'
            }
        });
    }
    constructor(prisma, email){
        this.prisma = prisma;
        this.email = email;
        this.logger = new _common.Logger(WithdrawalsService.name);
    }
};
WithdrawalsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], WithdrawalsService);

//# sourceMappingURL=withdrawals.service.js.map