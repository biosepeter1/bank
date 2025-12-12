"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentsService", {
    enumerable: true,
    get: function() {
        return PaymentsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _paystackservice = require("./paystack.service");
const _config = require("@nestjs/config");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaymentsService = class PaymentsService {
    /**
   * Initiate a deposit payment
   */ async initiateDeposit(userId, dto) {
        try {
            // Get user details
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
            if (!user.wallet) {
                throw new _common.BadRequestException('User wallet not found');
            }
            // Generate payment reference
            const reference = this.paystackService.generateReference('DEP');
            // Create payment record
            const payment = await this.prisma.payment.create({
                data: {
                    userId,
                    amount: new _client.Prisma.Decimal(dto.amount),
                    currency: 'NGN',
                    description: dto.description || 'Wallet deposit',
                    reference,
                    provider: _client.PaymentProvider.PAYSTACK,
                    method: dto.method,
                    status: _client.PaymentStatus.PENDING,
                    callbackUrl: dto.callbackUrl,
                    metadata: {
                        userEmail: user.email,
                        userName: `${user.firstName} ${user.lastName}`
                    }
                }
            });
            // Initialize payment with Paystack
            const paystackResponse = await this.paystackService.initializePayment({
                email: user.email,
                amount: this.paystackService.toKobo(dto.amount),
                reference,
                callback_url: dto.callbackUrl || `${this.configService.get('FRONTEND_URL')}/deposit/callback`,
                metadata: {
                    userId,
                    paymentId: payment.id,
                    type: 'deposit'
                },
                channels: this.getPaymentChannels(dto.method)
            });
            // Update payment with Paystack response
            await this.prisma.payment.update({
                where: {
                    id: payment.id
                },
                data: {
                    providerRef: paystackResponse.data.reference,
                    redirectUrl: paystackResponse.data.authorization_url,
                    providerResponse: paystackResponse
                }
            });
            return {
                paymentId: payment.id,
                reference,
                authorizationUrl: paystackResponse.data.authorization_url,
                accessCode: paystackResponse.data.access_code,
                amount: dto.amount,
                status: _client.PaymentStatus.PENDING
            };
        } catch (error) {
            this.logger.error('Deposit initiation failed:', error);
            throw new _common.InternalServerErrorException(error.message || 'Failed to initiate deposit');
        }
    }
    /**
   * Verify a payment
   */ async verifyPayment(dto) {
        try {
            // Find payment record
            const payment = await this.prisma.payment.findUnique({
                where: {
                    reference: dto.reference
                },
                include: {
                    user: {
                        include: {
                            wallet: true
                        }
                    }
                }
            });
            if (!payment) {
                throw new _common.NotFoundException('Payment not found');
            }
            // Verify with Paystack
            const verificationResponse = await this.paystackService.verifyPayment(dto.reference);
            const isSuccess = verificationResponse.data.status === 'success';
            const paidAmount = this.paystackService.fromKobo(verificationResponse.data.amount);
            // Update payment status
            const updatedPayment = await this.prisma.payment.update({
                where: {
                    id: payment.id
                },
                data: {
                    status: isSuccess ? _client.PaymentStatus.SUCCESS : _client.PaymentStatus.FAILED,
                    completedAt: isSuccess ? new Date() : undefined,
                    failedAt: !isSuccess ? new Date() : undefined,
                    providerResponse: verificationResponse
                }
            });
            // If payment successful, update wallet and create transaction
            if (isSuccess && payment.status !== _client.PaymentStatus.SUCCESS) {
                await this.processSuccessfulDeposit(payment, paidAmount);
            }
            return {
                paymentId: payment.id,
                reference: dto.reference,
                status: updatedPayment.status,
                amount: paidAmount,
                paidAt: verificationResponse.data.paid_at,
                channel: verificationResponse.data.channel,
                gatewayResponse: verificationResponse.data.gateway_response
            };
        } catch (error) {
            this.logger.error('Payment verification failed:', error);
            throw new _common.InternalServerErrorException(error.message || 'Failed to verify payment');
        }
    }
    /**
   * Process successful deposit
   */ async processSuccessfulDeposit(payment, amount) {
        const user = payment.user;
        const wallet = user.wallet;
        await this.prisma.$transaction(async (tx)=>{
            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId: user.id
                },
                data: {
                    balance: {
                        increment: new _client.Prisma.Decimal(amount)
                    }
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: _client.TransactionType.PAYMENT_GATEWAY_DEPOSIT,
                    status: _client.TransactionStatus.COMPLETED,
                    amount: new _client.Prisma.Decimal(amount),
                    currency: 'NGN',
                    balanceBefore: wallet.balance,
                    balanceAfter: updatedWallet.balance,
                    description: payment.description || 'Paystack deposit',
                    reference: `TXN_${payment.reference}`,
                    externalRef: payment.providerRef,
                    metadata: {
                        paymentId: payment.id,
                        provider: payment.provider,
                        method: payment.method
                    }
                }
            });
        });
        this.logger.log(`Deposit processed successfully: ${payment.reference} - ₦${amount}`);
    }
    /**
   * Get available banks
   */ async getBanks() {
        try {
            const response = await this.paystackService.getBanks();
            return response.data.filter((bank)=>bank.active && bank.supports_transfer).map((bank)=>({
                    name: bank.name,
                    code: bank.code,
                    slug: bank.slug,
                    supports_transfer: bank.supports_transfer
                }));
        } catch (error) {
            this.logger.error('Failed to fetch banks:', error);
            throw new _common.InternalServerErrorException('Failed to fetch bank list');
        }
    }
    /**
   * Resolve bank account details
   */ async resolveAccount(dto) {
        try {
            const response = await this.paystackService.resolveAccountNumber({
                account_number: dto.accountNumber,
                bank_code: dto.bankCode
            });
            return {
                accountNumber: response.data.account_number,
                accountName: response.data.account_name,
                bankId: response.data.bank_id
            };
        } catch (error) {
            this.logger.error('Account resolution failed:', error);
            throw new _common.BadRequestException(error.message || 'Failed to resolve account details');
        }
    }
    /**
   * Add a bank account
   */ async addBankAccount(userId, dto) {
        try {
            // Check if account already exists
            const existingAccount = await this.prisma.bankAccount.findFirst({
                where: {
                    userId,
                    accountNumber: dto.accountNumber,
                    bankCode: dto.bankCode
                }
            });
            if (existingAccount) {
                throw new _common.ConflictException('Bank account already exists');
            }
            // Verify account with Paystack
            const accountDetails = await this.resolveAccount({
                accountNumber: dto.accountNumber,
                bankCode: dto.bankCode
            });
            // If setting as primary, unset other primary accounts
            if (dto.isPrimary) {
                await this.prisma.bankAccount.updateMany({
                    where: {
                        userId,
                        isPrimary: true
                    },
                    data: {
                        isPrimary: false
                    }
                });
            }
            // Create bank account
            const bankAccount = await this.prisma.bankAccount.create({
                data: {
                    userId,
                    accountName: accountDetails.accountName,
                    accountNumber: dto.accountNumber,
                    bankName: dto.bankName,
                    bankCode: dto.bankCode,
                    isVerified: true,
                    verifiedAt: new Date(),
                    isPrimary: dto.isPrimary || false
                }
            });
            return bankAccount;
        } catch (error) {
            this.logger.error('Bank account creation failed:', error);
            throw new _common.InternalServerErrorException(error.message || 'Failed to add bank account');
        }
    }
    /**
   * Get user bank accounts
   */ async getBankAccounts(userId) {
        return this.prisma.bankAccount.findMany({
            where: {
                userId
            },
            orderBy: [
                {
                    isPrimary: 'desc'
                },
                {
                    createdAt: 'desc'
                }
            ]
        });
    }
    /**
   * Initiate withdrawal
   */ async initiateWithdrawal(userId, dto) {
        try {
            // Get user and wallet
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    wallet: true
                }
            });
            if (!user || !user.wallet) {
                throw new _common.NotFoundException('User or wallet not found');
            }
            // Check if user has sufficient balance
            const currentBalance = user.wallet.balance.toNumber();
            const withdrawalFee = this.calculateWithdrawalFee(dto.amount);
            const totalAmount = dto.amount + withdrawalFee;
            if (currentBalance < totalAmount) {
                throw new _common.BadRequestException(`Insufficient balance. Available: ₦${currentBalance.toLocaleString()}, Required: ₦${totalAmount.toLocaleString()}`);
            }
            // Get bank account
            const bankAccount = await this.prisma.bankAccount.findUnique({
                where: {
                    id: dto.bankAccountId,
                    userId
                }
            });
            if (!bankAccount) {
                throw new _common.NotFoundException('Bank account not found');
            }
            if (!bankAccount.isVerified) {
                throw new _common.BadRequestException('Bank account is not verified');
            }
            // Generate withdrawal reference
            const reference = this.paystackService.generateReference('WDR');
            // Create transfer recipient in Paystack
            const recipient = await this.paystackService.createTransferRecipient({
                type: 'nuban',
                name: bankAccount.accountName,
                account_number: bankAccount.accountNumber,
                bank_code: bankAccount.bankCode
            });
            // Create withdrawal record
            const withdrawal = await this.prisma.withdrawal.create({
                data: {
                    userId,
                    amount: new _client.Prisma.Decimal(dto.amount),
                    currency: 'NGN',
                    fee: new _client.Prisma.Decimal(withdrawalFee),
                    totalAmount: new _client.Prisma.Decimal(totalAmount),
                    bankAccountId: bankAccount.id,
                    recipientCode: recipient.data.recipient_code,
                    provider: _client.PaymentProvider.PAYSTACK,
                    status: _client.PaymentStatus.PENDING,
                    reference,
                    description: dto.description || 'Wallet withdrawal'
                }
            });
            // Initiate transfer with Paystack
            const transferResponse = await this.paystackService.initiateTransfer({
                source: 'balance',
                amount: this.paystackService.toKobo(dto.amount),
                recipient: recipient.data.recipient_code,
                reason: dto.description || 'Wallet withdrawal',
                reference
            });
            // Update withdrawal with transfer details
            await this.prisma.withdrawal.update({
                where: {
                    id: withdrawal.id
                },
                data: {
                    providerRef: transferResponse.data.transfer_code,
                    transferCode: transferResponse.data.transfer_code,
                    status: _client.PaymentStatus.PROCESSING,
                    processedAt: new Date(),
                    providerResponse: transferResponse
                }
            });
            // Deduct amount from wallet immediately
            await this.processWithdrawalDeduction(user, withdrawal, totalAmount);
            return {
                withdrawalId: withdrawal.id,
                reference,
                amount: dto.amount,
                fee: withdrawalFee,
                totalAmount,
                status: _client.PaymentStatus.PROCESSING,
                bankAccount: {
                    accountName: bankAccount.accountName,
                    accountNumber: bankAccount.accountNumber,
                    bankName: bankAccount.bankName
                }
            };
        } catch (error) {
            this.logger.error('Withdrawal initiation failed:', error);
            throw new _common.InternalServerErrorException(error.message || 'Failed to initiate withdrawal');
        }
    }
    /**
   * Process withdrawal wallet deduction
   */ async processWithdrawalDeduction(user, withdrawal, totalAmount) {
        await this.prisma.$transaction(async (tx)=>{
            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId: user.id
                },
                data: {
                    balance: {
                        decrement: new _client.Prisma.Decimal(totalAmount)
                    }
                }
            });
            // Create transaction record
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    type: _client.TransactionType.PAYMENT_GATEWAY_WITHDRAWAL,
                    status: _client.TransactionStatus.PROCESSING,
                    amount: new _client.Prisma.Decimal(totalAmount),
                    currency: 'NGN',
                    balanceBefore: user.wallet.balance,
                    balanceAfter: updatedWallet.balance,
                    description: withdrawal.description || 'Paystack withdrawal',
                    reference: `TXN_${withdrawal.reference}`,
                    externalRef: withdrawal.providerRef,
                    metadata: {
                        withdrawalId: withdrawal.id,
                        provider: withdrawal.provider,
                        bankAccountId: withdrawal.bankAccountId,
                        fee: withdrawal.fee.toNumber(),
                        withdrawalAmount: withdrawal.amount.toNumber()
                    }
                }
            });
        });
        this.logger.log(`Withdrawal deducted from wallet: ${withdrawal.reference} - ₦${totalAmount}`);
    }
    /**
   * Get user withdrawals
   */ async getWithdrawals(userId) {
        const withdrawals = await this.prisma.withdrawal.findMany({
            where: {
                userId
            },
            include: {
                bankAccount: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return withdrawals.map((withdrawal)=>({
                id: withdrawal.id,
                reference: withdrawal.reference,
                amount: withdrawal.amount.toNumber(),
                fee: withdrawal.fee?.toNumber() || 0,
                totalAmount: withdrawal.totalAmount.toNumber(),
                status: withdrawal.status,
                requestedAt: withdrawal.requestedAt,
                processedAt: withdrawal.processedAt,
                bankAccount: withdrawal.bankAccount ? {
                    id: withdrawal.bankAccount.id,
                    accountName: withdrawal.bankAccount.accountName,
                    accountNumber: withdrawal.bankAccount.accountNumber,
                    bankName: withdrawal.bankAccount.bankName,
                    bankCode: withdrawal.bankAccount.bankCode,
                    isVerified: withdrawal.bankAccount.isVerified,
                    isPrimary: withdrawal.bankAccount.isPrimary,
                    createdAt: withdrawal.bankAccount.createdAt
                } : null
            }));
    }
    /**
   * Get payment status
   */ async getPaymentStatus(paymentId, userId) {
        const whereClause = {
            id: paymentId
        };
        if (userId) {
            whereClause.userId = userId;
        }
        const payment = await this.prisma.payment.findUnique({
            where: whereClause
        });
        if (!payment) {
            throw new _common.NotFoundException('Payment not found');
        }
        return {
            ...payment,
            amount: payment.amount.toNumber()
        };
    }
    /**
   * Calculate withdrawal fee
   */ calculateWithdrawalFee(amount) {
        const feeAmount = amount * this.withdrawalFeeRate;
        return Math.min(Math.max(feeAmount, this.minWithdrawalFee), this.maxWithdrawalFee);
    }
    /**
   * Get payment channels based on method
   */ getPaymentChannels(method) {
        switch(method){
            case _client.PaymentMethod.CARD:
                return [
                    'card'
                ];
            case _client.PaymentMethod.BANK_TRANSFER:
                return [
                    'bank_transfer'
                ];
            case _client.PaymentMethod.USSD:
                return [
                    'ussd'
                ];
            case _client.PaymentMethod.QR:
                return [
                    'qr'
                ];
            case _client.PaymentMethod.MOBILE_MONEY:
                return [
                    'mobile_money'
                ];
            default:
                return [
                    'card',
                    'bank_transfer',
                    'ussd'
                ];
        }
    }
    constructor(prisma, paystackService, configService){
        this.prisma = prisma;
        this.paystackService = paystackService;
        this.configService = configService;
        this.logger = new _common.Logger(PaymentsService.name);
        this.withdrawalFeeRate = 0.01; // 1% fee
        this.minWithdrawalFee = 50; // Minimum ₦50 fee
        this.maxWithdrawalFee = 2000; // Maximum ₦2000 fee
    }
};
PaymentsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _paystackservice.PaystackService === "undefined" ? Object : _paystackservice.PaystackService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], PaymentsService);

//# sourceMappingURL=payments.service.js.map