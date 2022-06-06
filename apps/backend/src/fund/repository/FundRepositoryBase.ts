import {
  CreateHistoryError,
  DatabaseError,
  DEFAULT_FUND_FILTER,
  DEFAULT_HISTORY_FILTER,
  Filter,
  Fund,
  FundHistory,
  FundNotFoundError,
  FundRepository,
} from '@domain/feature-funds';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { Model } from 'mongoose';
import { FundEntity } from '../entity/base/FundEntity';
import { toMongooseOptions } from './Utils';

export abstract class FundRepositoryBase<
  H extends FundHistory,
  E extends FundEntity<H>,
  F extends Fund<H>,
> implements FundRepository<H, Fund<H>>
{
  constructor(private model: Model<E>, private historyModel: Model<H>) {}

  // TODO: create indexes?

  findAll(
    fundFilter: Filter = DEFAULT_FUND_FILTER,
    historyFilter = DEFAULT_HISTORY_FILTER,
  ): T.Task<F[]> {
    let find = this.model.find();
    const filter = toMongooseOptions(fundFilter);
    if (fundFilter.orderBy) {
      find = find.sort(filter.sort);
    }
    if (fundFilter.limit) {
      find = find.limit(fundFilter.limit);
    }

    return pipe(
      () =>
        find
          .populate({
            path: 'history',
            options: toMongooseOptions(historyFilter),
          })
          .exec(),
      T.map((records) => records.map((record) => this.toDomainObject(record))),
    );
  }

  public findOneByAddress(
    address: string,
    filter: Filter = DEFAULT_HISTORY_FILTER,
  ): TE.TaskEither<FundNotFoundError | DatabaseError, F> {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model
            .findOne({ address })
            .populate({
              path: 'history',
              options: toMongooseOptions(filter),
            })
            .exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainW((record) => {
        if (record) {
          return TE.right(this.toDomainObject(record as E));
        } else {
          return TE.left(new FundNotFoundError(address));
        }
      }),
    );
  }

  public save(fund: F): TE.TaskEither<DatabaseError, F> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { kind, ...rest } = fund;
    return pipe(
      TE.tryCatch(
        () => {
          return new this.model({
            ...rest,
          }).save();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chainFirstIOK((record) => {
        return T.of(
          Promise.all(
            fund.history.map((entry) =>
              new this.historyModel({
                ...entry,
                fundId: record._id,
              }).save(),
            ),
          ),
        );
      }),
      TE.map((record) => {
        return this.toDomainObject(record);
      }),
    );
  }

  public addHistoryEntry(
    fund: F,
    entry: H,
  ): TE.TaskEither<FundNotFoundError | CreateHistoryError | DatabaseError, H> {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ address: fund.address }).exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.map((fundModel) => {
        return new this.historyModel({
          ...entry,
          fundId: fundModel._id,
        }).save();
      }),
      TE.map((result) => result as unknown as H),
    );
  }

  /**
   * Template method that maps the raw entity to the domain object.
   */
  protected abstract toDomainObject(record: E): F;
}
