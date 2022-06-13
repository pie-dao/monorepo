import { YieldVault, YieldVaultHistory } from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import {
  YieldVaultEntity,
  YieldVaultHistoryModel,
  YieldVaultModel,
} from '../entity';
import { FundRepositoryBase } from '.';

@Injectable()
export class MongoYieldVaultRepository extends FundRepositoryBase<
  YieldVaultHistory,
  YieldVaultEntity,
  YieldVault
> {
  constructor() {
    super(YieldVaultModel, YieldVaultHistoryModel);
  }

  protected toDomainObject(entity: YieldVaultEntity): YieldVault {
    return new YieldVault(
      entity.chain,
      entity.address,
      entity.name,
      entity.symbol,
      entity.decimals,
      entity.history.map((entry) => entry),
    );
  }
}
