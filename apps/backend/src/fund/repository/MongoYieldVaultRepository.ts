import {
  FundFilters,
  YieldVault,
  YieldVaultHistory,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { FundRepositoryBase } from './base/FundRepositoryBase';
import {
  MarketDataModel,
  YieldVaultEntity,
  YieldVaultHistoryModel,
  YieldVaultModel,
} from './entity';

@Injectable()
export class MongoYieldVaultRepository extends FundRepositoryBase<
  YieldVaultHistory,
  YieldVaultEntity,
  YieldVault
> {
  constructor() {
    super(YieldVaultModel, MarketDataModel, YieldVaultHistoryModel);
  }

  protected getPaths(): Array<Omit<keyof FundFilters, 'entity'>> {
    return ['marketData', 'history', 'strategies'];
  }

  protected toDomainObject(entity: YieldVaultEntity): YieldVault {
    return new YieldVault(
      entity.chain,
      entity.address,
      entity.name,
      entity.symbol,
      entity.decimals,
      entity.coinGeckoId,
      entity.history.map((entry) => entry),
      entity.marketData.map((entry) => entry),
    );
  }
}
