import {
  Contract,
  ContractFilters,
  ContractRepository,
  DEFAULT_ENTITY_OPTIONS,
  FindOneParams,
} from '@domain/feature-funds';
import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
} from '@shared/util-types';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { ContractEntity } from '../entity/base/ContractEntity';
import { makeFind, makeFindOne, makeSaveWithKind } from '../Utils';

export abstract class ContractRepositoryBase<
  E extends ContractEntity,
  C extends Contract,
  F extends ContractFilters,
> implements ContractRepository<C, F>
{
  constructor(protected model: Model<E>, private discriminated = false) {}

  find(filters: F): T.Task<C[]> {
    return makeFind({
      defaultFilter: DEFAULT_ENTITY_OPTIONS,
      model: this.model,
      getPaths: () => this.getPaths(),
      toDomainObject: (record: E) => this.toDomainObject(record),
    })(filters);
  }

  findOne(
    params: FindOneParams,
    childFilters: Partial<Omit<F, 'entity'>> = {},
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, C> {
    return makeFindOne({
      model: this.model,
      getPaths: () => this.getPaths(),
      toDomainObject: (record: E) => this.toDomainObject(record),
    })(params, childFilters);
  }

  save(contract: C): TE.TaskEither<DatabaseError, C> {
    return makeSaveWithKind({
      model: this.model,
      saveChildren: (c: C, e: HydratedDocument<E>) => this.saveChildren(c, e),
      toDomainObject: (record: E) => this.toDomainObject(record),
    })(contract);
  }

  // 👇 These are template methods to be overridden with default implementations.

  /**
   * Saves the children after saving the parent record.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected saveChildren(
    _contract: C,
    _record: HydratedDocument<E>,
  ): Promise<unknown> {
    return Promise.resolve(undefined);
  }

  /**
   * Transforms the entity into a domain object.
   */
  protected abstract toDomainObject(record: E): C;

  /**
   * Returns all the paths that are either filtered or populated
   * eg: `['marketData', 'history']
   */
  protected abstract getPaths(): Array<Omit<keyof F, DefaultFiltersKey>>;
}
