import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaystackService } from './paystack.service';
import { PaystackDemoService } from './paystack-demo.service';
import { WebhookService } from './webhook.service';
import { DemoController } from './demo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
  ],
  controllers: [PaymentsController, DemoController],
  providers: [
    PaymentsService,
    WebhookService,
    PaystackDemoService,
    {
      provide: PaystackService,
      useFactory: (configService: ConfigService, demoService: PaystackDemoService) => {
        const paystackSecretKey = configService.get<string>('PAYSTACK_SECRET_KEY');
        
        // Use demo service if no real API key is provided or if key contains placeholder text
        if (!paystackSecretKey || paystackSecretKey.includes('your-paystack-secret-key')) {
          console.log('🎭 DEMO MODE: Using PaystackDemoService (no valid API key found)');
          return demoService;
        }
        
        console.log('🔑 PRODUCTION MODE: Using real PaystackService');
        return new PaystackService(configService);
      },
      inject: [ConfigService, PaystackDemoService],
    },
  ],
  exports: [
    PaymentsService,
    PaystackService,
    WebhookService,
    PaystackDemoService,
  ],
})
export class PaymentsModule {}
