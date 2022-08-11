import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DatabaseError, EntityNotFoundError } from '../error';
import { DefaultFiltersKey, QueryOptions } from './Filters';
import { Options } from './Options';

/**
 * The filter that should be used by default for contract records.
 */
export const DEFAULT_ENTITY_OPTIONS: Options<any, any> = {
  limit: 1000,
  orderBy: {
    _id: 'asc',
  },
};

/**
 * The filter that should be used by default for child records.
 */
export const DEFAULT_CHILD_FILTER: Options<any, any> = {
  limit: 1,
  orderBy: {
    _id: 'asc',
  },
};

/**
 * A repository abstracts away the underlying storage mechanism and exposes
 * a simple API for interacting with the underlying storage.
 * @param K the unique keys of {@link D}
 * @param D the data type of the domain objects we save
 * @param F the fields of {@link D} that we want to be able to filter
 */
export type Repository<
  K,
  D extends K,
  F extends QueryOptions = QueryOptions,
> = {
  /**
   * Returns all the keys that are used to uniquely identify a record (used for saving).
   */
  getKeys(): (keyof K)[];

  /**
   * Returns all entities that match the given filters.
   */
  find(filters: F): T.Task<Array<D>>;

  /**
   * Returns one entity that matches the given keys.
   */
  findOne(
    keys: K,
    childFilters: Partial<Omit<F, DefaultFiltersKey>>,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, D>;

  /**
   * Saves the entity to the database (also recursively saves child entities).
   * Also note that save will use {@link getKeys} when saving.
   * Saving is an upsert opeartion (not an insert, hence the need of {@link getKeys}).
   */
  save(entity: D): TE.TaskEither<DatabaseError, D>;
};
