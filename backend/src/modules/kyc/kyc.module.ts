import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { UploadModule } from '../../common/upload/upload.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [UploadModule, SettingsModule],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
