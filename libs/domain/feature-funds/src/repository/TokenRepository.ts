import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { MarketData, SupportedChain, Token } from '../fund';

export class DatabaseError extends Error {
  public kind: 'DatabaseError' = 'DatabaseError';
  constructor(public cause: unknown) {
    super(`Database operation failed: ${cause}`);
  }
}

export class CreateMarketDataError extends Error {
  public kind: 'CreateMarketDataError' = 'CreateMarketDataError';
  constructor(public message: string) {
    super(`Saving market data entry failed: ${message}`);
  }
}

export class TokenNotFoundError extends Error {
  public kind: 'TokenNotFoundError' = 'TokenNotFoundError';
  constructor(public address: string, public chain: SupportedChain) {
    super(`Token with address ${address} was not found on chain ${chain}.`);
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

export type Filters = {
  token: Filter;
  marketData: Filter;
};

export type Filter = {
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
};

export interface TokenRepository<T extends Token, F extends Filters> {
  /**
   * Returns all funds.
   */
  findAll(filters: F): T.Task<Array<T>>;

  /**
   * Tries to find a token by its address on a specific chain.
   * @returns either the token, or an error if the token was not found.
   */
  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<F, 'token'>,
  ): TE.TaskEither<TokenNotFoundError | DatabaseError, T>;

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
    TokenNotFoundError | CreateMarketDataError | DatabaseError,
    MarketData
  >;
}
