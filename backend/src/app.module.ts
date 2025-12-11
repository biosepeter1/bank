import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './common/upload/upload.module';
import { AccountStatusGuard } from './common/guards/account-status.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CardsModule } from './modules/cards/cards.module';
import { KycModule } from './modules/kyc/kyc.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { LoansModule } from './modules/loans/loans.module';
import { DepositsModule } from './modules/deposits/deposits.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { SettingsModule } from './modules/settings/settings.module';
import { OtpModule } from './modules/otp/otp.module';
import { SupportModule } from './modules/support/support.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { LiveChatModule } from './modules/live-chat/live-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UploadModule,
    AuthModule,
    UsersModule,
    WalletModule,
    TransactionsModule,
    CardsModule,
    KycModule,
    PaymentsModule,
    AuditModule,
    AdminModule,
    TransfersModule,
    LoansModule,
    DepositsModule,
    CurrencyModule,
    WithdrawalsModule,
    InvestmentsModule,
    SettingsModule,
    OtpModule,
    SupportModule,
    NotificationModule,
    ChatModule,
    LiveChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccountStatusGuard,
    },
  ],
})
export class AppModule { }
