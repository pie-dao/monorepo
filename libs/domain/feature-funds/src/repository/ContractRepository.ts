import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  Filters,
  Repository,
  SupportedChain,
} from '@shared/util-types';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Contract } from '../fund';
import { Options } from './filter';

/**
 * The filter that should be used by default for contract records.
 */
export const DEFAULT_ENTITY_OPTIONS: Options = {
  limit: 1000,
  orderBy: {
    _id: 'asc',
  },
};

/**
 * The filter that should be used by default for child records.
 */
export const DEFAULT_CHILD_FILTER: Options = {
  limit: 1,
  orderBy: {
    _id: 'asc',
  },
};

export type ContractFilters<F extends DefaultFiltersKey = 'entity'> =
  Filters<F>;

export type FindOneParams = {
  chain: SupportedChain;
  address: string;
};

export interface ContractRepository<
  C extends Contract,
  F extends ContractFilters,
> extends Repository<C, FindOneParams, F> {
  /**
   * Returns all contracts that match the given filters.
   */
  find(filters: F): T.Task<Array<C>>;

  /**
   * Tries to find a contract by its address on a specific chain.
   * @returns either the contract, or an error if the contract was not found.
   */
  findOne(
    params: FindOneParams,
    childFilters: Partial<Omit<F, 'entity'>>,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, C>;

  /**
   * Saves the contract to the database (recursively).
   */
  save(contract: C): TE.TaskEither<DatabaseError, C>;
}
