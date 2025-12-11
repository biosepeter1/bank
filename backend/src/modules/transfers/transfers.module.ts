import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SettingsModule } from '@/modules/settings/settings.module';
import { EmailService } from '@/common/services/email.service';
import { EmailVerifiedGuard } from '@/common/guards/email-verified.guard';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [TransfersController],
  providers: [TransfersService, EmailService, EmailVerifiedGuard],
  exports: [TransfersService],
})
export class TransfersModule {}
