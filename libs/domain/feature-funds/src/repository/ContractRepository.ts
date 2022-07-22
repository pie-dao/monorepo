import { SupportedChain } from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Contract } from '../fund';
import { ContractNotFoundError, DatabaseError } from './error';
import { Filter } from './filter';

/**
 * The filter that should be used by default for child records.
 */
export const DEFAULT_CHILD_FILTER: Filter = {
  limit: 1,
  orderBy: {
    _id: 'asc',
  },
};

/**
 * The filter that should be used by default for token records.
 */
export const DEFAULT_CONTRACT_FILTER: Filter = {
  limit: 1000,
  orderBy: {
    _id: 'asc',
  },
};

export type ContractFilters<F extends string = 'contract'> = Partial<
  Record<F, Filter>
>;

export interface ContractRepository<
  C extends Contract,
  F extends ContractFilters,
> {
  /**
   * Returns all contracts that match the given filters.
   */
  find(filters: F): T.Task<Array<C>>;

  /**
   * Tries to find a contract by its address on a specific chain.
   * @returns either the contract, or an error if the contract was not found.
   */
  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<F, 'contract'>,
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, C>;

  /**
   * Saves the contract to the database (recursively).
   */
  save(contract: C): TE.TaskEither<DatabaseError, C>;
}
