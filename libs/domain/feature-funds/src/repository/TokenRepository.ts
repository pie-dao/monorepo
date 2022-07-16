import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { MarketData, Token } from '../fund';
import { DatabaseError, BlockchainEntityNotFoundError } from './error';
import { Filter } from './filter';

export class CreateMarketDataError extends Error {
  public kind: 'CreateMarketDataError' = 'CreateMarketDataError';
  constructor(public message: string) {
    super(`Saving market data entry failed: ${message}`);
  }
}

/**
 * The filter that should be used by default for child records.
 */
export const DEFAULT_CHILD_FILTER: Filter = {
  limit: 1,
  orderBy: {
    timestamp: 'desc',
  },
};

/**
 * The filter that should be used by default for token records.
 */
export const DEFAULT_TOKEN_FILTER: Filter = {
  limit: 1000,
  orderBy: {
    timestamp: 'desc',
  },
};

export type TokenFilterField = 'token' | 'marketData';

export type TokenFilters = Partial<Record<TokenFilterField, Filter>>;

export interface TokenRepository<T extends Token, F extends TokenFilters> {
  /**
   * Returns all tokens that match the given filters.
   */
  find(filters: F): T.Task<Array<T>>;

  /**
   * Tries to find a token by its address on a specific chain.
   * @returns either the token, or an error if the token was not found.
   */
  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<F, 'token'>,
  ): TE.TaskEither<BlockchainEntityNotFoundError | DatabaseError, T>;

  /**
   * Saves the token to the database (recursively).
   */
  save(token: T): TE.TaskEither<DatabaseError, T>;

  /**
   * Adds a market data entry for the token with the given `chain` and `address`.
   */
  addMarketData(
    chain: SupportedChain,
    address: string,
    entry: MarketData,
  ): TE.TaskEither<
    BlockchainEntityNotFoundError | CreateMarketDataError | DatabaseError,
    MarketData
  >;
}
