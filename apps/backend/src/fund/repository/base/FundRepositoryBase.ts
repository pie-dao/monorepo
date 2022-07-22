import {
  ContractNotFoundError,
  CreateHistoryError,
  DatabaseError,
  DEFAULT_CHILD_FILTER,
  DEFAULT_CONTRACT_FILTER,
  Fund,
  FundFilters,
  FundHistory,
  FundRepository,
  MarketData,
} from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { FundEntity } from '../../';
import { TokenRepositoryBase } from './TokenRepositoryBase';

const DEFAULT_FILTERS: FundFilters = {
  contract: DEFAULT_CONTRACT_FILTER,
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
    F extends Fund<H>,
  >
  extends TokenRepositoryBase<E, F, FundFilters>
  implements FundRepository<H, Fund<H>>
{
  constructor(
    model: Model<E>,
    marketModel: Model<MarketData>,
    private historyModel: Model<H>,
    discriminated = false,
  ) {
    super(model, marketModel, discriminated);
  }

  find(filters: FundFilters = DEFAULT_FILTERS): T.Task<F[]> {
    return super.find(filters);
  }

  findOne(
    chain: SupportedChain,
    address: string,
    childFilters: Omit<FundFilters, 'contract'> = DEFAULT_CHILD_FILTERS,
  ): TE.TaskEither<ContractNotFoundError | DatabaseError, F> {
    return super.findOne(chain, address, childFilters);
  }

  public addHistoryEntry(
    chain: SupportedChain,
    address: string,
    entry: H,
  ): TE.TaskEither<
    DatabaseError | ContractNotFoundError | CreateHistoryError,
    H
  > {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ address, chain }).exec();
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

  protected getPaths(): Array<Omit<keyof FundFilters, 'contract'>> {
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
