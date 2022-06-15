import { PieSmartPool, PieSmartPoolHistory } from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { FundRepositoryBase } from '.';
import {
  PieSmartPoolEntity,
  PieSmartPoolHistoryModel,
  PieSmartPoolModel,
} from '../entity';

@Injectable()
export class MongoPieSmartPoolRepository extends FundRepositoryBase<
  PieSmartPoolHistory,
  PieSmartPoolEntity,
  PieSmartPool
> {
  constructor() {
    super(PieSmartPoolModel, PieSmartPoolHistoryModel);
  }

  protected toDomainObject(entity: PieSmartPoolEntity): PieSmartPool {
    return new PieSmartPool(
      entity.chain,
      entity.address,
      entity.name,
      entity.symbol,
      entity.decimals,
      entity.history.map((entry) => entry),
    );
  }
}
