import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DatabaseError, EntityNotFoundError } from '../error';
import { DefaultFiltersKey, Filters } from './Filters';

export interface Repository<
  E,
  K extends Record<string, unknown>,
  F extends Filters = Filters,
> {
  /**
   * Returns all entities that match the given filters.
   */
  find(filters: F): T.Task<Array<E>>;

  /**
   * Returns one entity that matches the given keys.
   */
  findOne(
    keys: K,
    childFilters: Omit<F, DefaultFiltersKey>,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, E>;

  /**
   * Saves the entity to the database (recursively).
   */
  save(entity: E): TE.TaskEither<DatabaseError, E>;
}
