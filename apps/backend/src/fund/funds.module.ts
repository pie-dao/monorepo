import { CoinGeckoAdapter } from '@domain/data-sync';
import { Module } from '@nestjs/common';
import { FundLoader } from './loaders/FundLoader';
import {
  MongooseConnectionProvider,
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
    MongooseConnectionProvider,
  ],
  exports: [
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
    FundLoader,
    MongooseConnectionProvider,
  ],
})
export class FundsModule {}
