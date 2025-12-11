import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DepositsService } from '../deposits/deposits.service';
import { PaystackWebhookService } from '../deposits/paystack.webhook';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks')
export class PaystackWebhookController {
  private readonly logger = new Logger(PaystackWebhookController.name);

  constructor(
    private paystackWebhookService: PaystackWebhookService,
    private depositsService: DepositsService,
  ) {}

  /**
   * Paystack webhook endpoint for demo mode
   * In demo mode, this accepts both signed webhooks and test requests
   */
  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paystack webhook endpoint (supports demo mode)' })
  async handlePaystackWebhook(
    @Body() event: any,
    @Headers('x-paystack-signature') signature: string
  ) {
    const isDemoMode = process.env.PAYSTACK_DEMO_MODE === 'true';

    if (!isDemoMode && signature) {
      // In production, verify the signature
      const payload = JSON.stringify(event);
      const isValid = this.paystackWebhookService.verifyWebhookSignature(
        payload,
        signature
      );

      if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    this.logger.log(
      `Received Paystack webhook: ${event.event} - Reference: ${event.data?.reference}`
    );

    // Handle the webhook event
    await this.paystackWebhookService.handleWebhookEvent(event);

    return { status: 'success' };
  }

  /**
   * Demo endpoint to simulate successful payment
   * For testing in development
   */
  @Post('paystack/demo/success')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demo endpoint to simulate successful Paystack payment' })
  async simulatePaystackSuccess(@Body() data: { reference: string }) {
    if (process.env.PAYSTACK_DEMO_MODE !== 'true') {
      throw new BadRequestException('Demo mode is not enabled');
    }

    this.logger.log(`[DEMO] Simulating successful payment - Reference: ${data.reference}`);

    try {
      const result = await this.depositsService.confirmPaystackDeposit(data.reference);
      return { status: 'success', data: result };
    } catch (error) {
      this.logger.error(`[DEMO] Error confirming deposit: ${error.message}`);
      throw new BadRequestException(`Failed to confirm deposit: ${error.message}`);
    }
  }

  /**
   * Demo endpoint to simulate failed payment
   */
  @Post('paystack/demo/failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demo endpoint to simulate failed Paystack payment' })
  async simulatePaystackFailed(@Body() data: { reference: string }) {
    if (process.env.PAYSTACK_DEMO_MODE !== 'true') {
      throw new BadRequestException('Demo mode is not enabled');
    }

    this.logger.log(`[DEMO] Simulating failed payment - Reference: ${data.reference}`);

    // In a real scenario, you would update the deposit status to FAILED
    return { status: 'success', message: 'Demo payment failure recorded' };
  }

  /**
   * Health check endpoint
   */
  @Post('paystack/health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check for webhook endpoint' })
  async healthCheck() {
    return {
      status: 'healthy',
      demoMode: process.env.PAYSTACK_DEMO_MODE === 'true',
      timestamp: new Date().toISOString(),
    };
  }
}
