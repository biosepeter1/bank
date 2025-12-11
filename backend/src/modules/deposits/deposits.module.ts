import { Module } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '@/common/services/email.service';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [DepositsController],
  providers: [DepositsService, PrismaService, EmailService],
  exports: [DepositsService],
})
export class DepositsModule {}
