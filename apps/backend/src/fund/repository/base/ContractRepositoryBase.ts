import {
  Contract,
  ContractFilters,
  ContractNotFoundError,
  ContractRepository,
  DatabaseError,
  DEFAULT_CONTRACT_FILTER,
} from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { ContractEntity } from '../entity/base/ContractEntity';
import { toMongooseOptions } from '../Utils';

export abstract class ContractRepositoryBase<
  E extends ContractEntity,
  C extends Contract,
  F extends ContractFilters,
> implements ContractRepository<C, F>
{
  constructor(protected model: Model<E>, private discriminated = false) {}

  find(filters: Partial<F>): T.Task<C[]> {
    const { contract = DEFAULT_CONTRACT_FILTER, ...rest } = filters;
    const filter = toMongooseOptions(contract);
    let find = this.model.find({}).sort(filter.sort).limit(filter.limit);

    this.getPaths().forEach((path: string) => {
      const pathFilter = rest[path];
      find = find.populate({
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
      () => find.exec(),
      T.map((records) => records.map((record) => this.toDomainObject(record))),
    );
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<F, 'contract'>,
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, C> {
    return pipe(
      TE.tryCatch(
        () => {
          let find = this.model.findOne({ chain, address });

          // 👇 this is the same as above, but extracting it into a function results in complex and unreadable code.
          this.getPaths().forEach((path: string) => {
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
          return TE.right(this.toDomainObject(record as E));
        } else {
          return TE.left(new ContractNotFoundError(address, chain));
        }
      }),
    );
  }

  save(contract: C): TE.TaskEither<DatabaseError, C> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kind, ...rest } = contract;
    const discriminator = this.discriminated ? { kind } : {};
    return pipe(
      TE.tryCatch(
        () => {
          return new this.model({
            ...discriminator,
            ...rest,
          }).save();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainFirstIOK((savedToken) => {
        return T.of(this.saveChildren(savedToken));
      }),
      TE.map((record) => {
        return this.toDomainObject(record);
      }),
    );
  }

  // 👇 These are template methods to be overridden with default implementations.

  /**
   * Saves the children after saving the parent record.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected saveChildren(_: HydratedDocument<E>): Promise<unknown> {
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
  protected abstract getPaths(): Array<Omit<keyof F, 'contract'>>;
}
