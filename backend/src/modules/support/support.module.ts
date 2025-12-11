import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { SupportGateway } from './support.gateway';
import { PrismaModule } from '@/prisma/prisma.module';
import { EmailService } from '@/common/services/email.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [PrismaModule, SettingsModule],
  controllers: [SupportController],
  providers: [SupportService, SupportGateway, EmailService],
  exports: [SupportService, SupportGateway],
})
export class SupportModule {}
