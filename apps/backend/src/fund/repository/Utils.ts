import {
  DatabaseError,
  DefaultFiltersKey,
  EntityNotFoundError,
  Options,
  QueryOptions,
} from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import {
  HydratedDocument,
  Model,
  QueryOptions as MQueryOptions,
} from 'mongoose';

export const toMongooseOptions = ({
  limit,
  orderBy,
  filter,
}: Options): MQueryOptions => {
  const sort: Record<string, number> = {};
  Object.keys(orderBy ?? {}).forEach((key) => {
    sort[key] = orderBy[key] === 'asc' ? 1 : -1;
  });
  return { limit, sort, ...filter };
};

export type FindOneParams<D, E, F extends QueryOptions> = {
  model: Model<E>;
  getPaths: () => Array<Omit<keyof F, DefaultFiltersKey>>;
  toDomainObject: (record: HydratedDocument<E>) => D;
};

export type FindParams<D, E, F extends QueryOptions> = {
  defaultFilter: Options;
} & FindOneParams<D, E, F>;

export const makeFind =
  <D, E, F extends QueryOptions>({
    defaultFilter,
    model,
    getPaths,
    toDomainObject,
  }: FindParams<D, E, F>) =>
  (filters: Partial<F>): T.Task<D[]> => {
    const { entity = defaultFilter, ...paths } = filters;
    const { sort, limit, ...filter } = toMongooseOptions(entity);
    let query = model.find(filter).sort(sort).limit(limit);

    getPaths().forEach((path: string) => {
      const pathFilter = paths[path];
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
  <D, E, F extends QueryOptions, K extends Record<string, unknown>>({
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

export type SaveParams<K, D extends K, E> = {
  keys: (keyof K)[];
  model: Model<E>;
  saveChildren: (
    domainObject: D,
    record: HydratedDocument<E>,
  ) => Promise<unknown>;
};

export const makeSave = <K, D extends K, E>({
  keys,
  model,
  saveChildren,
}: SaveParams<K, D, E>) => {
  const keyMap: Map<string, boolean> = new Map(
    keys.map((key) => [key.toString(), true]),
  );

  return (domainObject: D): TE.TaskEither<DatabaseError, D> => {
    const filter: Record<string, unknown> = {};

    Object.entries(domainObject)
      .filter(([key]) => keyMap.has(key))
      .forEach(([key, value]) => {
        filter[key] = value;
      });

    return pipe(
      TE.tryCatch(
        (): Promise<HydratedDocument<E>> => {
          return model
            .findOneAndUpdate(
              filter,
              {
                ...domainObject,
              },
              {
                upsert: true,
                new: true,
              },
            )
            .exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainFirstIOK((record) => {
        return T.of(saveChildren(domainObject, record));
      }),
      TE.map(() => {
        return domainObject;
      }),
    );
  };
};
