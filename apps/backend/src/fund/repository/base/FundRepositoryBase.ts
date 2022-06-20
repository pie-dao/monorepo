import {
  CreateHistoryError,
  DatabaseError,
  DEFAULT_CHILD_FILTER,
  DEFAULT_TOKEN_FILTER,
  Fund,
  FundFilters,
  FundHistory,
  FundRepository,
  MarketData,
  SupportedChain,
  TokenNotFoundError,
} from '@domain/feature-funds';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { FundEntity } from '../../';
import { TokenRepositoryBase } from './TokenRepositoryBase';

const DEFAULT_FILTERS: FundFilters = {
  token: DEFAULT_TOKEN_FILTER,
  marketData: DEFAULT_CHILD_FILTER,
  history: DEFAULT_CHILD_FILTER,
};

const DEFAULT_CHILD_FILTERS = {
  marketData: DEFAULT_CHILD_FILTER,
  history: DEFAULT_CHILD_FILTER,
};

export abstract class FundRepositoryBase<
    H extends FundHistory,
    E extends FundEntity<H>,
    T extends Fund<H>,
  >
  extends TokenRepositoryBase<E, T, FundFilters>
  implements FundRepository<H, Fund<H>>
{
  constructor(
    model: Model<E>,
    marketModel: Model<MarketData>,
    private historyModel: Model<H>,
  ) {
    super(model, marketModel);
  }

  findAll(filters: Partial<FundFilters> = DEFAULT_FILTERS): T.Task<T[]> {
    return super.findAll(filters);
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Partial<Omit<FundFilters, 'token'>> = DEFAULT_CHILD_FILTERS,
  ): TE.TaskEither<TokenNotFoundError | DatabaseError, T> {
    return super.findOne(chain, address, childFilters);
  }

  public addHistoryEntry(
    chain: SupportedChain,
    address: string,
    entry: H,
  ): TE.TaskEither<TokenNotFoundError | CreateHistoryError | DatabaseError, H> {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ filter: { address, chain } }).exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.map((tokenEntity) => {
        return new this.historyModel({
          ...entry,
          fundId: tokenEntity._id,
        }).save();
      }),
      TE.map((result) => result as unknown as H),
    );
  }

  protected getPaths(): Array<Omit<keyof FundFilters, 'token'>> {
    return ['marketData', 'history'];
  }

  protected saveChildren(token: HydratedDocument<E>): Promise<unknown> {
    return Promise.all([
      super.saveChildren(token),
      Promise.all(
        token.history.map((entry) =>
          new this.historyModel({
            ...entry,
            fundId: token._id,
          }).save(),
        ),
      ),
    ]);
  }
}
