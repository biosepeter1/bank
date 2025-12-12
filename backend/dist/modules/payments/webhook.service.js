"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookService", {
    enumerable: true,
    get: function() {
        return WebhookService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _paystackservice = require("./paystack.service");
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
let WebhookService = class WebhookService {
    /**
   * Handle Paystack webhook events
   */ async handlePaystackWebhook(signature, payload) {
        try {
            // Verify webhook signature
            if (!this.paystackService.verifyWebhookSignature(payload, signature)) {
                this.logger.warn('Invalid webhook signature received');
                throw new _common.BadRequestException('Invalid webhook signature');
            }
            const event = JSON.parse(payload);
            this.logger.log(`Received webhook event: ${event.event} for reference: ${event.data.reference}`);
            // Route webhook event to appropriate handler
            switch(event.event){
                case 'charge.success':
                    await this.handleChargeSuccess(event);
                    break;
                case 'charge.failed':
                case 'charge.cancelled':
                    await this.handleChargeFailed(event);
                    break;
                case 'transfer.success':
                    await this.handleTransferSuccess(event);
                    break;
                case 'transfer.failed':
                case 'transfer.reversed':
                    await this.handleTransferFailed(event);
                    break;
                default:
                    this.logger.log(`Unhandled webhook event: ${event.event}`);
            }
            return {
                message: 'Webhook processed successfully'
            };
        } catch (error) {
            this.logger.error('Webhook processing failed:', error);
            throw error;
        }
    }
    /**
   * Handle successful charge (deposit)
   */ async handleChargeSuccess(event) {
        try {
            const { data } = event;
            const reference = data.reference;
            // Find payment record
            const payment = await this.prisma.payment.findUnique({
                where: {
                    reference
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
                this.logger.warn(`Payment not found for reference: ${reference}`);
                return;
            }
            // Skip if already processed
            if (payment.status === _client.PaymentStatus.SUCCESS) {
                this.logger.log(`Payment already processed: ${reference}`);
                return;
            }
            const paidAmount = this.paystackService.fromKobo(data.amount);
            await this.prisma.$transaction(async (tx)=>{
                // Update payment status
                await tx.payment.update({
                    where: {
                        id: payment.id
                    },
                    data: {
                        status: _client.PaymentStatus.SUCCESS,
                        completedAt: new Date(),
                        webhookData: data,
                        providerResponse: {
                            ...payment.providerResponse,
                            webhookData: data
                        }
                    }
                });
                // Update wallet balance
                const updatedWallet = await tx.wallet.update({
                    where: {
                        userId: payment.userId
                    },
                    data: {
                        balance: {
                            increment: new _client.Prisma.Decimal(paidAmount)
                        }
                    }
                });
                // Create transaction record
                await tx.transaction.create({
                    data: {
                        userId: payment.userId,
                        type: 'PAYMENT_GATEWAY_DEPOSIT',
                        status: _client.TransactionStatus.COMPLETED,
                        amount: new _client.Prisma.Decimal(paidAmount),
                        currency: 'NGN',
                        balanceBefore: payment.user.wallet?.balance || new _client.Prisma.Decimal(0),
                        balanceAfter: updatedWallet.balance,
                        description: payment.description || 'Paystack deposit',
                        reference: `TXN_${payment.reference}`,
                        externalRef: payment.providerRef,
                        metadata: {
                            paymentId: payment.id,
                            provider: payment.provider,
                            method: payment.method,
                            channel: data.channel,
                            gatewayResponse: data.gateway_response,
                            fees: this.paystackService.fromKobo(data.fees)
                        }
                    }
                });
            });
            this.logger.log(`Deposit webhook processed successfully: ${reference} - ₦${paidAmount}`);
        } catch (error) {
            this.logger.error('Charge success webhook processing failed:', error);
            throw error;
        }
    }
    /**
   * Handle failed charge (deposit)
   */ async handleChargeFailed(event) {
        try {
            const { data } = event;
            const reference = data.reference;
            // Find payment record
            const payment = await this.prisma.payment.findUnique({
                where: {
                    reference
                }
            });
            if (!payment) {
                this.logger.warn(`Payment not found for reference: ${reference}`);
                return;
            }
            // Skip if already processed
            if (payment.status === _client.PaymentStatus.FAILED) {
                this.logger.log(`Payment failure already processed: ${reference}`);
                return;
            }
            // Update payment status
            await this.prisma.payment.update({
                where: {
                    id: payment.id
                },
                data: {
                    status: _client.PaymentStatus.FAILED,
                    failedAt: new Date(),
                    webhookData: data,
                    providerResponse: {
                        ...payment.providerResponse,
                        webhookData: data
                    }
                }
            });
            this.logger.log(`Deposit failure webhook processed: ${reference} - ${data.gateway_response}`);
        } catch (error) {
            this.logger.error('Charge failed webhook processing failed:', error);
            throw error;
        }
    }
    /**
   * Handle successful transfer (withdrawal)
   */ async handleTransferSuccess(event) {
        try {
            const { data } = event;
            const reference = data.reference;
            // Find withdrawal record
            const withdrawal = await this.prisma.withdrawal.findUnique({
                where: {
                    reference
                }
            });
            if (!withdrawal) {
                this.logger.warn(`Withdrawal not found for reference: ${reference}`);
                return;
            }
            // Skip if already processed
            if (withdrawal.status === _client.PaymentStatus.SUCCESS) {
                this.logger.log(`Withdrawal already processed: ${reference}`);
                return;
            }
            await this.prisma.$transaction(async (tx)=>{
                // Update withdrawal status
                await tx.withdrawal.update({
                    where: {
                        id: withdrawal.id
                    },
                    data: {
                        status: _client.PaymentStatus.SUCCESS,
                        completedAt: new Date(),
                        providerResponse: {
                            ...withdrawal.providerResponse,
                            webhookData: data
                        }
                    }
                });
                // Update transaction status
                await tx.transaction.updateMany({
                    where: {
                        reference: `TXN_${withdrawal.reference}`,
                        status: _client.TransactionStatus.PROCESSING
                    },
                    data: {
                        status: _client.TransactionStatus.COMPLETED,
                        metadata: {
                            ...withdrawal.providerResponse || {},
                            transferCompletedAt: new Date().toISOString(),
                            gatewayResponse: data.gateway_response || 'Transfer completed'
                        }
                    }
                });
            });
            this.logger.log(`Withdrawal webhook processed successfully: ${reference} - ₦${withdrawal.amount}`);
        } catch (error) {
            this.logger.error('Transfer success webhook processing failed:', error);
            throw error;
        }
    }
    /**
   * Handle failed transfer (withdrawal)
   */ async handleTransferFailed(event) {
        try {
            const { data } = event;
            const reference = data.reference;
            // Find withdrawal record
            const withdrawal = await this.prisma.withdrawal.findUnique({
                where: {
                    reference
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
                this.logger.warn(`Withdrawal not found for reference: ${reference}`);
                return;
            }
            // Skip if already processed
            if (withdrawal.status === _client.PaymentStatus.FAILED) {
                this.logger.log(`Withdrawal failure already processed: ${reference}`);
                return;
            }
            const failureReason = data.gateway_response || 'Transfer failed';
            await this.prisma.$transaction(async (tx)=>{
                // Update withdrawal status
                await tx.withdrawal.update({
                    where: {
                        id: withdrawal.id
                    },
                    data: {
                        status: _client.PaymentStatus.FAILED,
                        failedAt: new Date(),
                        failureReason,
                        providerResponse: {
                            ...withdrawal.providerResponse,
                            webhookData: data
                        }
                    }
                });
                // Update transaction status
                await tx.transaction.updateMany({
                    where: {
                        reference: `TXN_${withdrawal.reference}`,
                        status: _client.TransactionStatus.PROCESSING
                    },
                    data: {
                        status: _client.TransactionStatus.FAILED,
                        metadata: {
                            ...withdrawal.providerResponse || {},
                            failureReason,
                            failedAt: new Date().toISOString()
                        }
                    }
                });
                // Refund amount to wallet (since it was already deducted)
                const refundAmount = withdrawal.totalAmount.toNumber();
                const updatedWallet = await tx.wallet.update({
                    where: {
                        userId: withdrawal.userId
                    },
                    data: {
                        balance: {
                            increment: new _client.Prisma.Decimal(refundAmount)
                        }
                    }
                });
                // Create refund transaction
                await tx.transaction.create({
                    data: {
                        userId: withdrawal.userId,
                        type: 'REFUND',
                        status: _client.TransactionStatus.COMPLETED,
                        amount: new _client.Prisma.Decimal(refundAmount),
                        currency: 'NGN',
                        balanceBefore: withdrawal.user.wallet?.balance || new _client.Prisma.Decimal(0),
                        balanceAfter: updatedWallet.balance,
                        description: `Withdrawal refund - ${failureReason}`,
                        reference: `REF_${withdrawal.reference}`,
                        externalRef: withdrawal.providerRef,
                        metadata: {
                            originalWithdrawalId: withdrawal.id,
                            failureReason,
                            refundType: 'withdrawal_failure'
                        }
                    }
                });
            });
            this.logger.log(`Withdrawal failure webhook processed with refund: ${reference} - ₦${withdrawal.totalAmount} refunded`);
        } catch (error) {
            this.logger.error('Transfer failed webhook processing failed:', error);
            throw error;
        }
    }
    constructor(prisma, paystackService){
        this.prisma = prisma;
        this.paystackService = paystackService;
        this.logger = new _common.Logger(WebhookService.name);
    }
};
WebhookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _paystackservice.PaystackService === "undefined" ? Object : _paystackservice.PaystackService
    ])
], WebhookService);

//# sourceMappingURL=webhook.service.js.map