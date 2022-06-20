import {
  CreateMarketDataError,
  DatabaseError,
  DEFAULT_TOKEN_FILTER,
  Filters,
  MarketData,
  SupportedChain,
  Token,
  TokenNotFoundError,
  TokenRepository,
} from '@domain/feature-funds';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { TokenEntity } from '../../entity';
import { toMongooseOptions } from '../Utils';

export abstract class TokenRepositoryBase<
  E extends TokenEntity,
  T extends Token,
  F extends Filters,
> implements TokenRepository<T, F>
{
  constructor(
    protected model: Model<E>,
    protected marketModel: Model<MarketData>,
  ) {}

  findAll(filters: Partial<F>): T.Task<T[]> {
    const { token = DEFAULT_TOKEN_FILTER, ...rest } = filters;
    let find = this.model.find({});
    const filter = toMongooseOptions(token);
    find = find.sort(filter.sort);
    find = find.limit(filter.limit);

    this.getPaths().forEach((path: string) => {
      const pathFilter = rest[path];
      find = find.populate({
        path,
        options: pathFilter ? toMongooseOptions(pathFilter) : {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      // 👆 This is because of a weird Mongoose typing.
    });

    return pipe(
      () => find.exec(),
      T.map((records) => records.map((record) => this.toDomainObject(record))),
    );
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Partial<Omit<F, 'token'>>,
  ): TE.TaskEither<TokenNotFoundError | DatabaseError, T> {
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
          return TE.left(new TokenNotFoundError(address, chain));
        }
      }),
    );
  }

  save(token: T): TE.TaskEither<DatabaseError, T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kind, ...rest } = token;
    return pipe(
      TE.tryCatch(
        () => {
          return new this.model({
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

  addMarketData(
    chain: SupportedChain,
    address: string,
    entry: MarketData,
  ): TE.TaskEither<
    TokenNotFoundError | DatabaseError | CreateMarketDataError,
    MarketData
  > {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ filter: { address, chain } }).exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.map((tokenEntity) => {
        return new this.marketModel({
          ...entry,
          tokenId: tokenEntity._id,
        }).save();
      }),
      TE.map((result) => result as unknown as MarketData),
    );
  }

  // 👇 These are template methods to be overridden with default implementations.

  /**
   * Transforms the entity into a domain object.
   */
  protected abstract toDomainObject(record: E): T;

  /**
   * Returns all the paths that are either filtered or populated
   * eg: `['marketData', 'history']
   */
  protected abstract getPaths(): Array<Omit<keyof F, 'token'>>;

  /**
   * Saves all the child records of a token entity.
   */
  protected saveChildren(token: HydratedDocument<E>): Promise<unknown> {
    return Promise.all(
      token.marketData.map((entry) =>
        new this.marketModel({
          ...entry,
          tokenId: token._id,
        }).save(),
      ),
    );
  }
}
