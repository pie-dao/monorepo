import {
  DatabaseError,
  DEFAULT_CHILD_FILTER,
  DEFAULT_TOKEN_FILTER,
  Filters,
  SupportedChain,
  Token,
  TokenNotFoundError,
} from '@domain/feature-funds';
import { Injectable } from '@nestjs/common';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { MarketDataModel, TokenEntity, YieldVaultModel } from '../entity';
import { TokenRepositoryBase } from './base/TokenRepositoryBase';

const DEFAULT_FILTERS = {
  token: DEFAULT_TOKEN_FILTER,
  marketData: DEFAULT_CHILD_FILTER,
};

const DEFAULT_CHILD_FILTERS = {
  marketData: DEFAULT_CHILD_FILTER,
};

@Injectable()
export class MongoTokenRepository extends TokenRepositoryBase<
  TokenEntity,
  Token,
  Filters
> {
  constructor() {
    super(YieldVaultModel, MarketDataModel);
  }

  findAll(filters: Filters = DEFAULT_FILTERS): T.Task<Token[]> {
    return super.findAll(filters);
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<Filters, 'token'> = DEFAULT_CHILD_FILTERS,
  ): TE.TaskEither<TokenNotFoundError | DatabaseError, Token> {
    return super.findOne(chain, address, childFilters);
  }

  protected toDomainObject(entity: TokenEntity): Token {
    return {
      kind: entity.kind,
      chain: entity.chain,
      address: entity.address,
      name: entity.name,
      symbol: entity.symbol,
      decimals: entity.decimals,
      marketData: entity.marketData.map((entry) => entry),
    };
  }
}
