import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaystackService } from './paystack.service';
import { PaymentStatus, TransactionStatus, Prisma } from '@prisma/client';

interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    fees: number;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
    };
    authorization?: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    // Transfer specific fields
    transfer_code?: string;
    recipient?: {
      active: boolean;
      createdAt: string;
      currency: string;
      domain: string;
      id: number;
      integration: number;
      name: string;
      recipient_code: string;
      type: string;
      updatedAt: string;
      is_deleted: boolean;
      details: {
        account_number: string;
        account_name: string;
        bank_code: string;
        bank_name: string;
      };
    };
    reason?: string;
    source?: string;
    source_details?: {
      type: string;
      currency: string;
      available_balance: number;
      ledger_balance: number;
    };
    failures?: any;
    titan_code?: string;
    transfer_code_id?: string;
  };
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paystackService: PaystackService,
  ) {}

  /**
   * Handle Paystack webhook events
   */
  async handlePaystackWebhook(signature: string, payload: string): Promise<{ message: string }> {
    try {
      // Verify webhook signature
      if (!this.paystackService.verifyWebhookSignature(payload, signature)) {
        this.logger.warn('Invalid webhook signature received');
        throw new BadRequestException('Invalid webhook signature');
      }

      const event: PaystackWebhookEvent = JSON.parse(payload);
      this.logger.log(`Received webhook event: ${event.event} for reference: ${event.data.reference}`);

      // Route webhook event to appropriate handler
      switch (event.event) {
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

      return { message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Webhook processing failed:', error);
      throw error;
    }
  }

  /**
   * Handle successful charge (deposit)
   */
  private async handleChargeSuccess(event: PaystackWebhookEvent) {
    try {
      const { data } = event;
      const reference = data.reference;

      // Find payment record
      const payment = await this.prisma.payment.findUnique({
        where: { reference },
        include: { user: { include: { wallet: true } } },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for reference: ${reference}`);
        return;
      }

      // Skip if already processed
      if (payment.status === PaymentStatus.SUCCESS) {
        this.logger.log(`Payment already processed: ${reference}`);
        return;
      }

      const paidAmount = this.paystackService.fromKobo(data.amount);
      
      await this.prisma.$transaction(async (tx) => {
        // Update payment status
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCESS,
            completedAt: new Date(),
            webhookData: data,
            providerResponse: { ...payment.providerResponse as any, webhookData: data },
          },
        });

        // Update wallet balance
        const updatedWallet = await tx.wallet.update({
          where: { userId: payment.userId },
          data: {
            balance: {
              increment: new Prisma.Decimal(paidAmount),
            },
          },
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            userId: payment.userId,
            type: 'PAYMENT_GATEWAY_DEPOSIT',
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(paidAmount),
            currency: 'NGN',
            balanceBefore: payment.user.wallet?.balance || new Prisma.Decimal(0),
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
              fees: this.paystackService.fromKobo(data.fees),
            },
          },
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
   */
  private async handleChargeFailed(event: PaystackWebhookEvent) {
    try {
      const { data } = event;
      const reference = data.reference;

      // Find payment record
      const payment = await this.prisma.payment.findUnique({
        where: { reference },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for reference: ${reference}`);
        return;
      }

      // Skip if already processed
      if (payment.status === PaymentStatus.FAILED) {
        this.logger.log(`Payment failure already processed: ${reference}`);
        return;
      }

      // Update payment status
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          failedAt: new Date(),
          webhookData: data,
          providerResponse: { ...payment.providerResponse as any, webhookData: data },
        },
      });

      this.logger.log(`Deposit failure webhook processed: ${reference} - ${data.gateway_response}`);
    } catch (error) {
      this.logger.error('Charge failed webhook processing failed:', error);
      throw error;
    }
  }

  /**
   * Handle successful transfer (withdrawal)
   */
  private async handleTransferSuccess(event: PaystackWebhookEvent) {
    try {
      const { data } = event;
      const reference = data.reference;

      // Find withdrawal record
      const withdrawal = await this.prisma.withdrawal.findUnique({
        where: { reference },
      });

      if (!withdrawal) {
        this.logger.warn(`Withdrawal not found for reference: ${reference}`);
        return;
      }

      // Skip if already processed
      if (withdrawal.status === PaymentStatus.SUCCESS) {
        this.logger.log(`Withdrawal already processed: ${reference}`);
        return;
      }

      await this.prisma.$transaction(async (tx) => {
        // Update withdrawal status
        await tx.withdrawal.update({
          where: { id: withdrawal.id },
          data: {
            status: PaymentStatus.SUCCESS,
            completedAt: new Date(),
            providerResponse: { ...withdrawal.providerResponse as any, webhookData: data },
          },
        });

        // Update transaction status
        await tx.transaction.updateMany({
          where: {
            reference: `TXN_${withdrawal.reference}`,
            status: TransactionStatus.PROCESSING,
          },
          data: {
            status: TransactionStatus.COMPLETED,
            metadata: {
              ...(withdrawal.providerResponse as any) || {},
              transferCompletedAt: new Date().toISOString(),
              gatewayResponse: data.gateway_response || 'Transfer completed',
            },
          },
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
   */
  private async handleTransferFailed(event: PaystackWebhookEvent) {
    try {
      const { data } = event;
      const reference = data.reference;

      // Find withdrawal record
      const withdrawal = await this.prisma.withdrawal.findUnique({
        where: { reference },
        include: { user: { include: { wallet: true } } },
      });

      if (!withdrawal) {
        this.logger.warn(`Withdrawal not found for reference: ${reference}`);
        return;
      }

      // Skip if already processed
      if (withdrawal.status === PaymentStatus.FAILED) {
        this.logger.log(`Withdrawal failure already processed: ${reference}`);
        return;
      }

      const failureReason = data.gateway_response || 'Transfer failed';

      await this.prisma.$transaction(async (tx) => {
        // Update withdrawal status
        await tx.withdrawal.update({
          where: { id: withdrawal.id },
          data: {
            status: PaymentStatus.FAILED,
            failedAt: new Date(),
            failureReason,
            providerResponse: { ...withdrawal.providerResponse as any, webhookData: data },
          },
        });

        // Update transaction status
        await tx.transaction.updateMany({
          where: {
            reference: `TXN_${withdrawal.reference}`,
            status: TransactionStatus.PROCESSING,
          },
          data: {
            status: TransactionStatus.FAILED,
            metadata: {
              ...(withdrawal.providerResponse as any) || {},
              failureReason,
              failedAt: new Date().toISOString(),
            },
          },
        });

        // Refund amount to wallet (since it was already deducted)
        const refundAmount = withdrawal.totalAmount.toNumber();
        
        const updatedWallet = await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            balance: {
              increment: new Prisma.Decimal(refundAmount),
            },
          },
        });

        // Create refund transaction
        await tx.transaction.create({
          data: {
            userId: withdrawal.userId,
            type: 'REFUND',
            status: TransactionStatus.COMPLETED,
            amount: new Prisma.Decimal(refundAmount),
            currency: 'NGN',
            balanceBefore: withdrawal.user.wallet?.balance || new Prisma.Decimal(0),
            balanceAfter: updatedWallet.balance,
            description: `Withdrawal refund - ${failureReason}`,
            reference: `REF_${withdrawal.reference}`,
            externalRef: withdrawal.providerRef,
            metadata: {
              originalWithdrawalId: withdrawal.id,
              failureReason,
              refundType: 'withdrawal_failure',
            },
          },
        });
      });

      this.logger.log(`Withdrawal failure webhook processed with refund: ${reference} - ₦${withdrawal.totalAmount} refunded`);
    } catch (error) {
      this.logger.error('Transfer failed webhook processing failed:', error);
      throw error;
    }
  }
}