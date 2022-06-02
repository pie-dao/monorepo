import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Address } from '../fund/Address';
import { Fund } from '../fund/Fund';

export class FundNotFoundError extends Error {
  public kind: 'FundNotFoundError' = 'FundNotFoundError';
  constructor(public address: Address) {
    super(`Fund with address ${address} was not found`);
  }
}

/**
 * This filter can be used to fine-grain the snapshots returned by a fund query.
 */
export type SnapshotFilter = {
  limit: number;
  orderBy: Record<'timestamp', 'asc' | 'desc'>;
};

/**
 * The filter that should be used by default in repository implementations.
 */
export const DEFAULT_FILTER: SnapshotFilter = {
  limit: 100,
  orderBy: {
    timestamp: 'desc',
  },
};

export type FundRepository<F extends Fund> = {
  /**
   * Returns all funds.
   */
  findAll: (filter: SnapshotFilter) => T.Task<Array<F>>;
  /**
   * Tries to find a fund by its address.
   * @returns either the fund, or an error if the fund was not found.
   */
  findOneByAddress: (
    address: Address,
    filter: SnapshotFilter,
  ) => TE.TaskEither<FundNotFoundError, F>;
};
