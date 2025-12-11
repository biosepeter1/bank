import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaystackDemoService } from './paystack-demo.service';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(
    private readonly demoService: PaystackDemoService,
    private readonly webhookService: WebhookService,
  ) {}

  @Get('info')
  @ApiOperation({ 
    summary: 'Get demo mode information',
    description: 'Get current demo mode status and statistics'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Demo info retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        mode: { type: 'string', example: 'demo' },
        totalPayments: { type: 'number', example: 5 },
        totalTransfers: { type: 'number', example: 2 },
        totalRecipients: { type: 'number', example: 3 },
        warning: { type: 'string', example: 'This is demo mode. No real money transactions will occur.' },
      },
    },
  })
  getDemoInfo() {
    return this.demoService.getDemoInfo();
  }

  @Post('webhook/charge/:reference')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Simulate charge webhook event',
    description: 'Simulate a Paystack webhook for charge success/failure (Demo only)'
  })
  @ApiResponse({ status: 200, description: 'Webhook event simulated successfully' })
  async simulateChargeWebhook(
    @Param('reference') reference: string,
    @Body('success') success: boolean = true,
  ) {
    const eventType = success ? 'charge.success' : 'charge.failed';
    const webhookEvent = await this.demoService.simulateWebhookEvent(reference, eventType);
    
    const payload = JSON.stringify(webhookEvent);
    const signature = 'demo-signature'; // Demo signature
    
    return this.webhookService.handlePaystackWebhook(signature, payload);
  }

  @Post('webhook/transfer/:reference')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Simulate transfer webhook event',
    description: 'Simulate a Paystack webhook for transfer success/failure (Demo only)'
  })
  @ApiResponse({ status: 200, description: 'Webhook event simulated successfully' })
  async simulateTransferWebhook(
    @Param('reference') reference: string,
    @Body('success') success: boolean = true,
  ) {
    const eventType = success ? 'transfer.success' : 'transfer.failed';
    const webhookEvent = await this.demoService.simulateWebhookEvent(reference, eventType);
    
    const payload = JSON.stringify(webhookEvent);
    const signature = 'demo-signature'; // Demo signature
    
    return this.webhookService.handlePaystackWebhook(signature, payload);
  }

  @Post('simulate-payment-flow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Simulate complete payment flow',
    description: 'Simulate a complete payment flow from initiation to webhook confirmation (Demo only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment flow simulated successfully',
    schema: {
      type: 'object',
      properties: {
        step1: { type: 'object', description: 'Payment initialization' },
        step2: { type: 'object', description: 'Payment verification' },
        step3: { type: 'object', description: 'Webhook processing' },
        message: { type: 'string', example: 'Complete demo payment flow executed successfully' },
      },
    },
  })
  async simulatePaymentFlow(
    @Body() data: { 
      email: string; 
      amount: number; 
      success?: boolean;
    }
  ) {
    // Step 1: Initialize payment
    const initResponse = await this.demoService.initializePayment({
      email: data.email,
      amount: this.demoService.toKobo(data.amount),
      metadata: { demo: true, simulatedFlow: true },
    });

    // Step 2: Verify payment
    const verifyResponse = await this.demoService.verifyPayment(
      initResponse.data.reference
    );

    // Step 3: Simulate webhook (if payment was successful)
    let webhookResponse: any = null;
    if (verifyResponse.data.status === 'success') {
      const webhookEvent = await this.demoService.simulateWebhookEvent(
        initResponse.data.reference, 
        'charge.success'
      );
      
      webhookResponse = await this.webhookService.handlePaystackWebhook(
        'demo-signature', 
        JSON.stringify(webhookEvent)
      );
    }

    return {
      step1: initResponse,
      step2: verifyResponse,
      step3: webhookResponse,
      message: 'Complete demo payment flow executed successfully',
      warning: 'This is a demo simulation. No real money was processed.',
    };
  }

  @Get('banks')
  @ApiOperation({ 
    summary: 'Get demo banks list',
    description: 'Get list of demo Nigerian banks for testing'
  })
  @ApiResponse({ status: 200, description: 'Demo banks retrieved successfully' })
  async getDemoBanks() {
    return this.demoService.getBanks();
  }

  @Post('resolve-account')
  @ApiOperation({ 
    summary: 'Resolve demo account',
    description: 'Resolve a demo bank account (returns random demo names)'
  })
  @ApiResponse({ status: 200, description: 'Demo account resolved successfully' })
  async resolveDemoAccount(
    @Body() data: { accountNumber: string; bankCode: string }
  ) {
    return this.demoService.resolveAccountNumber({
      account_number: data.accountNumber,
      bank_code: data.bankCode,
    });
  }

  // Admin endpoint to reset demo data
  @Post('reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Reset demo data (Super Admin only)',
    description: 'Clear all demo payment and transfer data'
  })
  @ApiResponse({ status: 200, description: 'Demo data reset successfully' })
  async resetDemoData() {
    // Clear demo data maps
    (this.demoService as any).demoPayments.clear();
    (this.demoService as any).demoTransfers.clear();
    (this.demoService as any).demoRecipients.clear();
    
    return {
      message: 'Demo data has been reset successfully',
      timestamp: new Date().toISOString(),
    };
  }
}