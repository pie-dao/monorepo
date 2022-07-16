import { SupportedChain } from '@shared/util-types';
import * as TE from 'fp-ts/TaskEither';
import { TokenRepository } from '.';
import { Fund, FundHistory } from '../fund';
import { BlockchainEntityNotFoundError, DatabaseError } from './error';
import { Filter } from './filter';

export class CreateHistoryError extends Error {
  public kind: 'CreateHistoryError' = 'CreateHistoryError';
  constructor(public message: string) {
    super(`Saving history entry failed: ${message}`);
  }
}

export type FundFilterField = 'token' | 'marketData' | 'history';

export type FundFilters = Partial<
  Record<FundFilterField, Filter<'timestamp' | 'symbol' | 'name'>>
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
    DatabaseError | BlockchainEntityNotFoundError | CreateHistoryError,
    H
  >;
}
