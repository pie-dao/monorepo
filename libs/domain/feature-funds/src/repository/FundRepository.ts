import * as TE from 'fp-ts/TaskEither';
import { Filter, Filters, TokenRepository } from '.';
import { Fund, FundHistory, SupportedChain } from '../fund';
import { DatabaseError, TokenNotFoundError } from './TokenRepository';

export class CreateHistoryError extends Error {
  public kind: 'CreateHistoryError' = 'CreateHistoryError';
  constructor(public message: string) {
    super(`Saving history entry failed: ${message}`);
  }
}

export type FundFilters = Filters & {
  history: Filter;
};

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
    TokenNotFoundError | CreateHistoryError | DatabaseError,
    H
  >;
}
