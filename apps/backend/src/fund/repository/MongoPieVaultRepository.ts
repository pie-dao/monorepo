import { PieVault, PieVaultHistory } from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { FundRepositoryBase } from './base/FundRepositoryBase';
import {
  MarketDataModel,
  PieVaultEntity,
  PieVaultHistoryModel,
  PieVaultModel,
} from './entity';

@Injectable()
export class MongoPieVaultRepository extends FundRepositoryBase<
  PieVaultHistory,
  PieVaultEntity,
  PieVault
> {
  constructor() {
    super(PieVaultModel, MarketDataModel, PieVaultHistoryModel);
  }

  protected toDomainObject(entity: PieVaultEntity): PieVault {
    return new PieVault(
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
