import { PieVault, PieVaultHistory } from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { PieVaultEntity, PieVaultHistoryModel, PieVaultModel } from '../entity';
import { FundRepositoryBase } from './FundRepositoryBase';

@Injectable()
export class MongoPieVaultRepository extends FundRepositoryBase<
  PieVaultHistory,
  PieVaultEntity,
  PieVault
> {
  constructor() {
    super(PieVaultModel, PieVaultHistoryModel);
  }

  protected toDomainObject(entity: PieVaultEntity): PieVault {
    return new PieVault(
      entity.address,
      entity.name,
      entity.symbol,
      entity.decimals,
      entity.history.map((entry) => entry),
    );
  }
}
