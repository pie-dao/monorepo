import {
  DatabaseError,
  EntityNotFoundError,
  SupportedChain,
} from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { YieldData, YieldVaultStrategy } from '../fund';
import { ContractFilters, FindOneParams } from './ContractRepository';

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
    keys: FindOneParams,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, S>;

  /**
   * Adds a yield data entry for the strategy with the given `chain` and `address`.
   */
  addYieldData(
    chain: SupportedChain,
    address: string,
    entry: YieldData,
  ): TE.TaskEither<
    EntityNotFoundError | CreateYieldError | DatabaseError,
    YieldData
  >;
}
