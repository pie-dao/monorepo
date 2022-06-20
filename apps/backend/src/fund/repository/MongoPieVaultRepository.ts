import { PieVault, PieVaultHistory } from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import {
  MarketDataModel,
  PieVaultEntity,
  PieVaultHistoryModel,
  PieVaultModel,
} from '../entity';
import { FundRepositoryBase } from '.';

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
      entity.history.map((entry) => entry),
    );
  }
}
