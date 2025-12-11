import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/common/services/email.service';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService, PrismaService, EmailService],
  exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
