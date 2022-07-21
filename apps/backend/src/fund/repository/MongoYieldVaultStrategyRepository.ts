import {
  ContractFilters,
  ContractNotFoundError,
  DatabaseError,
  DEFAULT_CONTRACT_FILTER,
  TestStrategy,
  YieldVaultStrategy,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { ContractRepositoryBase } from './base/ContractRepositoryBase';
import {
  DiscriminatedYieldVaultStrategyEntity,
  DiscriminatedYieldVaultStrategyModel,
} from './entity';

const DEFAULT_FILTERS = {
  contract: DEFAULT_CONTRACT_FILTER,
};

@Injectable()
export class MongoYieldVaultStrategyRepository extends ContractRepositoryBase<
  DiscriminatedYieldVaultStrategyEntity,
  YieldVaultStrategy,
  ContractFilters
> {
  constructor() {
    super(DiscriminatedYieldVaultStrategyModel, true);
  }

  find(
    filters: ContractFilters = DEFAULT_FILTERS,
  ): T.Task<YieldVaultStrategy[]> {
    return super.find(filters);
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<ContractFilters, 'contract'> = {},
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, YieldVaultStrategy> {
    return super.findOne(chain, address, childFilters);
  }

  protected getPaths(): Array<keyof ContractFilters> {
    return [];
  }

  protected toDomainObject(
    entity: DiscriminatedYieldVaultStrategyEntity,
  ): YieldVaultStrategy {
    // TODO: kind switch to pick the right strategy class 👇
    return new TestStrategy(
      entity.chain,
      entity.address,
      entity.name,
      entity.underlyingToken,
      entity.trusted,
    );
  }
}
