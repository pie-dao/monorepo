import {
  CreateHistoryError,
  DatabaseError,
  Fund,
  FundFilters,
  FundHistory,
  FundRepository,
  MarketData,
  SupportedChain,
  TokenNotFoundError,
} from '@domain/feature-funds';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { HydratedDocument, Model } from 'mongoose';
import { FundEntity } from '../../';
import { TokenRepositoryBase } from './TokenRepositoryBase';

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

  public addHistoryEntry(
    chain: SupportedChain,
    address: string,
    entry: H,
  ): TE.TaskEither<TokenNotFoundError | CreateHistoryError | DatabaseError, H> {
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
