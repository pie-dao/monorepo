import { Filter } from '@ethersproject/providers';
import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { YieldVaultStrategy } from '../fund';
import { ContractNotFoundError, DatabaseError } from './error';

export const STRATEGY_PARENT_FIELD = 'yieldVaultId';

export type StrategyFilterField = 'chain' | typeof STRATEGY_PARENT_FIELD;

export type StrategyFilters = Partial<Record<StrategyFilterField, Filter>>;

export interface YieldVaultStrategyRepository<
  S extends YieldVaultStrategy,
  F extends StrategyFilters,
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
}
