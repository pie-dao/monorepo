import { Filter } from '@domain/feature-funds';
import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  Filters,
} from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { HydratedDocument, Model, QueryOptions } from 'mongoose';

export const toMongooseOptions = ({ limit, orderBy }: Filter): QueryOptions => {
  const sort: Record<string, number> = {};
  Object.keys(orderBy ?? {}).forEach((key) => {
    sort[key] = orderBy[key] === 'asc' ? 1 : -1;
  });
  return { limit, sort };
};

export type FindOneParams<D, E, F extends Filters> = {
  model: Model<E>;
  getPaths: () => Array<Omit<keyof F, DefaultFiltersKey>>;
  toDomainObject: (record: HydratedDocument<E>) => D;
};

export type FindParams<D, E, F extends Filters> = {
  defaultFilter: Filter;
} & FindOneParams<D, E, F>;

export const makeFind =
  <D, E, F extends Filters>({
    defaultFilter,
    model,
    getPaths,
    toDomainObject,
  }: FindParams<D, E, F>) =>
  (filters: Partial<F>): T.Task<D[]> => {
    const { entity = defaultFilter, ...rest } = filters;
    const filter = toMongooseOptions(entity);
    let query = model.find({}).sort(filter.sort).limit(filter.limit);

    getPaths().forEach((path: string) => {
      const pathFilter = rest[path];
      query = query.populate({
        path,
        options: pathFilter ? toMongooseOptions(pathFilter) : {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      // 👆 This is because of a weird Mongoose typing 👇
      // the typing of this includes an `UnpackedIntersection` type that
      // handles the E | E[] case (findOne or findAll). We already typed
      // `find` here (or rather Typescript inferred it), so it is safe to use `any`
      // instead of dealing with the `UnpackedIntersection` type's monstrous complexity.
    });

    return pipe(
      () => query.exec(),
      T.map((records) => records.map((record) => toDomainObject(record))),
    );
  };

export const makeFindOne =
  <D, E, F extends Filters, K extends Record<string, unknown>>({
    model,
    getPaths,
    toDomainObject,
  }: FindOneParams<D, E, F>) =>
  (
    keys: K,
    childFilters: Partial<Omit<F, 'entity'>>,
  ): TE.TaskEither<EntityNotFoundError | DatabaseError, D> => {
    return pipe(
      TE.tryCatch(
        () => {
          let find = model.findOne(keys);

          // 👇 this is the same as above, but extracting it into a function results in complex and unreadable code.
          getPaths().forEach((path: string) => {
            const pathFilter = childFilters[path];
            find = find.populate({
              path,
              options: pathFilter ? toMongooseOptions(pathFilter) : {},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any;
          });

          return find.exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainW((record) => {
        if (record) {
          return TE.right(toDomainObject(record));
        } else {
          return TE.left(new EntityNotFoundError(keys));
        }
      }),
    );
  };

export type SaveParams<D, E> = {
  model: Model<E>;
  saveChildren: (
    domainObject: D,
    record: HydratedDocument<E>,
  ) => Promise<unknown>;
  toDomainObject: (record: HydratedDocument<E>) => D;
};

export const makeSave =
  <D, E>({ model, saveChildren, toDomainObject }: SaveParams<D, E>) =>
  (domainObject: D): TE.TaskEither<DatabaseError, D> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...rest } = domainObject;

    return pipe(
      TE.tryCatch(
        (): Promise<HydratedDocument<E>> => {
          return new model({
            ...rest,
          }).save() as Promise<HydratedDocument<E>>;
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainFirstIOK((record) => {
        return T.of(saveChildren(domainObject, record));
      }),
      TE.map((record) => {
        return toDomainObject(record);
      }),
    );
  };

export type SaveWithKindParams<D extends { kind: string }, E> = {
  model: Model<E>;
  saveChildren: (
    domainObject: D,
    record: HydratedDocument<E>,
  ) => Promise<unknown>;
  toDomainObject: (record: HydratedDocument<E>) => D;
};

export const makeSaveWithKind =
  <D extends { kind: string }, E>({
    model,
    saveChildren,
    toDomainObject,
  }: SaveWithKindParams<D, E>) =>
  (domainObject: D): TE.TaskEither<DatabaseError, D> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kind, ...rest } = domainObject;
    const discriminator = { kind };

    return pipe(
      TE.tryCatch(
        (): Promise<HydratedDocument<E>> => {
          return new model({
            ...discriminator,
            ...rest,
          }).save() as Promise<HydratedDocument<E>>;
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainFirstIOK((record) => {
        return T.of(saveChildren(domainObject, record));
      }),
      TE.map((record) => {
        return toDomainObject(record);
      }),
    );
  };
