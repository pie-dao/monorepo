import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  SupportedChain,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { MarketData, Token } from '../fund';
import { ContractRepository } from './ContractRepository';
import { Filter } from './filter';

export class CreateMarketDataError extends Error {
  public kind: 'CreateMarketDataError' = 'CreateMarketDataError';
  constructor(public message: string) {
    super(`Saving market data entry failed: ${message}`);
  }
}

export type TokenFilterField = DefaultFiltersKey | 'marketData';

export type TokenFilters = Partial<Record<TokenFilterField, Filter>>;

export interface TokenRepository<T extends Token, F extends TokenFilters>
  extends ContractRepository<T, F> {
  /**
   * Adds a market data entry for the token with the given `chain` and `address`.
   */
  addMarketData(
    chain: SupportedChain,
    address: string,
    entry: MarketData,
  ): TE.TaskEither<
    EntityNotFoundError | CreateMarketDataError | DatabaseError,
    MarketData
  >;
}
