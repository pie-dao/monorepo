import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_ENTITY_OPTIONS,
  FindOneParams,
  Token,
  TokenFilters,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { DatabaseError, EntityNotFoundError } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { TokenRepositoryBase } from './base/TokenRepositoryBase';
import {
  DiscriminatedTokenEntity,
  DiscriminatedTokenModel,
  MarketDataModel,
} from './entity';

const DEFAULT_FILTERS = {
  entity: DEFAULT_ENTITY_OPTIONS,
  marketData: DEFAULT_CHILD_FILTER,
};

const DEFAULT_CHILD_FILTERS = {
  marketData: DEFAULT_CHILD_FILTER,
};

@Injectable()
export class MongoTokenRepository extends TokenRepositoryBase<
  DiscriminatedTokenEntity,
  Token,
  TokenFilters
> {
  constructor() {
    super(DiscriminatedTokenModel, MarketDataModel, true);
  }

  find(filters: TokenFilters = DEFAULT_FILTERS): T.Task<Token[]> {
    return super.find(filters);
  }

  findOne(
    keys: FindOneParams,
    childFilters: Omit<TokenFilters, 'entity'> = DEFAULT_CHILD_FILTERS,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, Token> {
    return super.findOne(keys, childFilters);
  }

  protected getPaths(): Array<keyof TokenFilters> {
    return ['marketData'];
  }

  protected toDomainObject(entity: DiscriminatedTokenEntity): Token {
    return {
      kind: entity.kind,
      chain: entity.chain,
      address: entity.address,
      name: entity.name,
      symbol: entity.symbol,
      decimals: entity.decimals,
      coinGeckoId: entity.coinGeckoId,
      marketData: entity.marketData.map((entry) => entry),
    };
  }
}
