import { CoinGeckoAdapter } from '@domain/data-sync';
import {
  ContractFilters,
  CreateYieldError,
  DEFAULT_ENTITY_FILTER,
  FindOneParams,
  MaiPolygonStrategy,
  MAI_POLYGON_STRATEGY_KIND,
  YieldData,
  YieldVaultStrategy,
  YieldVaultStrategyRepository,
} from '@domain/feature-funds';
import { Inject, Injectable } from '@nestjs/common';
import {
  DatabaseError,
  EntityNotFoundError,
  SupportedChain,
} from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { EthersProvider } from '../../ethers';
import { ContractRepositoryBase } from './base/ContractRepositoryBase';
import {
  DiscriminatedYieldVaultStrategyEntity,
  DiscriminatedYieldVaultStrategyModel,
  YieldVaultStrategyEntity,
} from './entity';
import { TestStrategy, TEST_STRATEGY_KIND } from './test';

const DEFAULT_FILTERS = {
  entity: DEFAULT_ENTITY_FILTER,
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
  constructor(
    @Inject() private cg: CoinGeckoAdapter,
    @Inject() private provider: EthersProvider,
  ) {
    super(DiscriminatedYieldVaultStrategyModel, true);
  }

  find(
    filters: ContractFilters = DEFAULT_FILTERS,
  ): T.Task<YieldVaultStrategy[]> {
    return super.find(filters);
  }

  findOne(
    keys: FindOneParams,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, YieldVaultStrategy> {
    return super.findOne(keys);
  }

  addYieldData(
    chain: SupportedChain,
    address: string,
    entry: YieldData,
  ): TE.TaskEither<
    EntityNotFoundError | DatabaseError | CreateYieldError,
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
    switch (entity.kind) {
      case MAI_POLYGON_STRATEGY_KIND:
        return new MaiPolygonStrategy(
          entity.address,
          entity.underlyingToken,
          entity.trusted,
          entity.vaults,
          entity.yields,
          this.cg,
          this.provider.useValue,
        );
      case TEST_STRATEGY_KIND:
        return new TestStrategy(
          entity.chain,
          entity.address,
          entity.name,
          entity.underlyingToken,
          entity.trusted,
          entity.vaults,
          entity.yields,
        );
      default:
        throw new Error(`Unknown strategy kind: ${entity.kind}`);
    }
  }
}
