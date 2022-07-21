import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { YieldData, YieldVaultStrategy } from '../fund';
import { ContractFilters } from './ContractRepository';
import { ContractNotFoundError, DatabaseError } from './error';

export class CreateYieldError extends Error {
  public kind: 'CreateYieldError' = 'CreateYieldError';
  constructor(public message: string) {
    super(`Saving yield entry failed: ${message}`);
  }
}

export interface YieldVaultStrategyRepository<
  S extends YieldVaultStrategy,
  F extends ContractFilters,
> {
  /**
   * Finds strategies using the given filters.
   */
  find(filters: F): T.Task<Array<S>>;

  /**
   * Tries to find a token by its address on a specific chain.
   * @returns either the token, or an error if the token was not found.
   */
  findOne(
    chain: SupportedChain,
    address: string,
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, S>;

  /**
   * Adds a yield data entry for the strategy with the given `chain` and `address`.
   */
  addYieldData(
    chain: SupportedChain,
    address: string,
    entry: YieldData,
  ): TE.TaskEither<
    ContractNotFoundError | CreateYieldError | DatabaseError,
    YieldData
  >;
}
