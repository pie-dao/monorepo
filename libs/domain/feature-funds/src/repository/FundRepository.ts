import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  Options,
} from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { ContractParams, TokenRepository } from '.';
import { Fund, FundHistory } from '../fund';

export class CreateHistoryError extends Error {
  public kind: 'CreateHistoryError' = 'CreateHistoryError';
  constructor(public message: string) {
    super(`Saving history entry failed: ${message}`);
  }
}

export type FundFilterField = DefaultFiltersKey | 'marketData' | 'history';

export type FundFilters = Partial<
  Record<FundFilterField, Options<'_id' | 'timestamp' | 'symbol' | 'name'>>
>;

export interface FundRepository<H extends FundHistory, T extends Fund<H>>
  extends TokenRepository<T, FundFilters> {
  /**
   * Adds a history entry for the given fund.
   */
  addFundHistory: (
    keys: ContractParams,
    entry: H,
  ) => TE.TaskEither<
    DatabaseError | EntityNotFoundError | CreateHistoryError,
    H
  >;
}
