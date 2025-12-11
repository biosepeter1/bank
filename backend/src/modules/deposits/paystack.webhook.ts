import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { DepositsService } from './deposits.service';

@Injectable()
export class PaystackWebhookService {
  private readonly logger = new Logger(PaystackWebhookService.name);

  constructor(private depositsService: DepositsService) {}

  /**
   * Verify Paystack webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    if (!secret) {
      this.logger.error('Paystack secret key not configured');
      return false;
    }

    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    return hash === signature;
  }

  /**
   * Handle Paystack webhook events
   */
  async handleWebhookEvent(event: any) {
    const { event: eventType, data } = event;

    try {
      switch (eventType) {
        case 'charge.success':
          await this.handleChargeSuccess(data);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(data);
          break;
        default:
          this.logger.log(`Unhandled Paystack event: ${eventType}`);
      }
    } catch (error) {
      this.logger.error(`Error handling Paystack webhook: ${error.message}`, error);
      throw new BadRequestException('Webhook processing failed');
    }
  }

  /**
   * Handle successful charge
   */
  private async handleChargeSuccess(data: any) {
    const reference = data.reference;
    this.logger.log(`Processing successful charge with reference: ${reference}`);

    // Confirm the deposit
    await this.depositsService.confirmPaystackDeposit(reference);
  }

  /**
   * Handle failed charge
   */
  private async handleChargeFailed(data: any) {
    const reference = data.reference;
    this.logger.log(`Charge failed with reference: ${reference}`);
    // TODO: Update deposit status to FAILED
  }
}
