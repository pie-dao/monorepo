import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  SupportedChain,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { TokenRepository } from '.';
import { Fund, FundHistory } from '../fund';
import { Filter } from './filter';

export class CreateHistoryError extends Error {
  public kind: 'CreateHistoryError' = 'CreateHistoryError';
  constructor(public message: string) {
    super(`Saving history entry failed: ${message}`);
  }
}

export type FundFilterField = DefaultFiltersKey | 'marketData' | 'history';

export type FundFilters = Partial<
  Record<FundFilterField, Filter<'_id' | 'timestamp' | 'symbol' | 'name'>>
>;

export interface FundRepository<H extends FundHistory, T extends Fund<H>>
  extends TokenRepository<T, FundFilters> {
  /**
   * Adds a history entry for the given fund.
   */
  addHistoryEntry: (
    chain: SupportedChain,
    address: string,
    entry: H,
  ) => TE.TaskEither<
    DatabaseError | EntityNotFoundError | CreateHistoryError,
    H
  >;
}
