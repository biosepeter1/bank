import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { EmailService } from '@/common/services/email.service';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [LoansController],
  providers: [LoansService, EmailService],
  exports: [LoansService],
})
export class LoansModule {}
