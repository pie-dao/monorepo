import { CoinGeckoAdapter } from '@domain/data-sync';
import { Module } from '@nestjs/common';
import { FundLoader } from './loaders/FundLoader';
import {
  MongoPieSmartPoolRepository,
  MongoPieVaultRepository,
  MongoYieldVaultRepository,
} from './repository';

const CoinGeckoAdapterProvider = {
  provide: CoinGeckoAdapter,
  useClass: CoinGeckoAdapter,
};

@Module({
  imports: [],
  controllers: [],
  providers: [
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
    FundLoader,
    CoinGeckoAdapterProvider,
  ],
  exports: [
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
    FundLoader,
  ],
})
export class FundsModule {}
