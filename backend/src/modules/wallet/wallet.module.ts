import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { BanksController } from './banks.controller';
import { WalletService } from './wallet.service';
import { ExchangeRateService } from '../../common/services/exchange-rate.service';
import { TransferLimitsService } from '../../common/services/transfer-limits.service';

@Module({
  controllers: [WalletController, BanksController],
  providers: [WalletService, ExchangeRateService, TransferLimitsService],
  exports: [WalletService],
})
export class WalletModule {}
