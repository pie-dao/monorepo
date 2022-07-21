import {
  ContractNotFoundError,
  DatabaseError,
  DEFAULT_CHILD_FILTER,
  DEFAULT_CONTRACT_FILTER,
  Token,
  TokenFilters,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { TokenRepositoryBase } from './base/TokenRepositoryBase';
import {
  DiscriminatedTokenEntity,
  DiscriminatedTokenModel,
  MarketDataModel,
} from './entity';

const DEFAULT_FILTERS = {
  contract: DEFAULT_CONTRACT_FILTER,
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
    chain: SupportedChain,
    address: string,
    childFilters: Omit<TokenFilters, 'contract'> = DEFAULT_CHILD_FILTERS,
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, Token> {
    return super.findOne(chain, address, childFilters);
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
