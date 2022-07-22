import {
  ContractFilters,
  ContractNotFoundError,
  CreateYieldError,
  DatabaseError,
  DEFAULT_CONTRACT_FILTER,
  TestStrategy,
  YieldData,
  YieldVaultStrategy,
  YieldVaultStrategyRepository,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { SupportedChain } from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { ContractRepositoryBase } from './base/ContractRepositoryBase';
import {
  DiscriminatedYieldVaultStrategyEntity,
  DiscriminatedYieldVaultStrategyModel,
  YieldVaultStrategyEntity,
} from './entity';

const DEFAULT_FILTERS = {
  contract: DEFAULT_CONTRACT_FILTER,
};

@Injectable()
export class MongoYieldVaultStrategyRepository
  extends ContractRepositoryBase<
    DiscriminatedYieldVaultStrategyEntity,
    YieldVaultStrategy,
    ContractFilters
  >
  implements YieldVaultStrategyRepository<YieldVaultStrategy, ContractFilters>
{
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

  addYieldData(
    chain: SupportedChain,
    address: string,
    entry: YieldData,
  ): TE.TaskEither<
    ContractNotFoundError | DatabaseError | CreateYieldError,
    YieldData
  > {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ address, chain }).exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainIOK((strategyEntity: YieldVaultStrategyEntity) => {
        strategyEntity.yields.push(entry);
        return TE.tryCatch(
          () => this.model.updateOne({ address, chain }, strategyEntity).exec(),
          (err: unknown) => new DatabaseError(err),
        );
      }),
      TE.chain(() => {
        return TE.of(entry);
      }),
    );
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
      entity.vaults,
      entity.yields,
    );
  }
}
