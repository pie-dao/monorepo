import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Fund } from '..';
import { FundHistory } from '../fund';

export class DatabaseError extends Error {
  public kind: 'DatabaseError' = 'DatabaseError';
  constructor(public cause: unknown) {
    super(`Database operation failed: ${cause}`);
  }
}

export class FundNotFoundError extends Error {
  public kind: 'FundNotFoundError' = 'FundNotFoundError';
  constructor(public address: string) {
    super(`Fund with address ${address} was not found`);
  }
}

export class CreateHistoryError extends Error {
  public kind: 'CreateHistoryError' = 'CreateHistoryError';
  constructor(public message: string) {
    super(`Saving history entry failed: ${message}`);
  }
}

export type Filter = {
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
};

/**
 * The history filter that should be used by default in repository implementations.
 */
export const DEFAULT_HISTORY_FILTER: Filter = {
  limit: 1,
  orderBy: {
    timestamp: 'desc',
  },
};

/**
 * The fund filter that should be used by default in repository implementations.
 */
export const DEFAULT_FUND_FILTER: Filter = {
  limit: 1000,
};

export type FundRepository<H extends FundHistory, F extends Fund<H>> = {
  /**
   * Returns all funds.
   */
  findAll: (fundFilter: Filter, historyFilter: Filter) => T.Task<Array<F>>;

  /**
   * Tries to find a fund by its address.
   * @returns either the fund, or an error if the fund was not found.
   */
  findOneByAddress: (
    address: string,
    filter: Filter,
  ) => TE.TaskEither<FundNotFoundError | DatabaseError, F>;

  /**
   * Saves the fund to the database.
   */
  save(fund: F): TE.TaskEither<DatabaseError, F>;

  /**
   * Adds a history entry for the given fund.
   */
  addHistoryEntry: (
    fund: F,
    entry: H,
  ) => TE.TaskEither<FundNotFoundError | CreateHistoryError | DatabaseError, H>;
};
