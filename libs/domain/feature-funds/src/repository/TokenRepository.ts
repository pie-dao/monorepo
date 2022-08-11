import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  Options,
  Repository,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { MarketData, Token } from '../fund';
import { ContractParams } from './ContractParams';

export class CreateMarketDataError extends Error {
  public kind: 'CreateMarketDataError' = 'CreateMarketDataError';
  constructor(public message: string) {
    super(`Saving market data entry failed: ${message}`);
  }
}

export type TokenFilterField = DefaultFiltersKey | 'marketData';

export type TokenFilters = Partial<
  Record<TokenFilterField, Options<'_id' | 'symbol', '_id' | 'kind' | 'symbol'>>
>;

export interface TokenRepository<T extends Token, F extends TokenFilters>
  extends Repository<ContractParams, T, F> {
  /**
   * Adds a market data entry for the token with the given `chain` and `address`.
   */
  addMarketData(
    keys: ContractParams,
    entry: MarketData,
  ): TE.TaskEither<
    EntityNotFoundError | CreateMarketDataError | DatabaseError,
    MarketData
  >;
}
