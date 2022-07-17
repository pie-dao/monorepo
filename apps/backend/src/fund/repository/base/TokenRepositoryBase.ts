import {
  ContractNotFoundError,
  CreateMarketDataError,
  DatabaseError,
  MarketData,
  Token,
  TokenFilters,
  TokenRepository,
} from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { HydratedDocument, Model, Types } from 'mongoose';
import { TokenEntity } from '../entity';
import { ContractRepositoryBase } from './ContractRepositoryBase';

export abstract class TokenRepositoryBase<
    E extends TokenEntity,
    T extends Token,
    F extends TokenFilters,
  >
  extends ContractRepositoryBase<E, T, F>
  implements TokenRepository<T, F>
{
  constructor(
    model: Model<E>,
    protected marketModel: Model<MarketData>,
    discriminated = false,
  ) {
    super(model, discriminated);
  }

  addMarketData(
    chain: SupportedChain,
    address: string,
    entry: MarketData,
  ): TE.TaskEither<
    ContractNotFoundError | DatabaseError | CreateMarketDataError,
    MarketData
  > {
    return pipe(
      TE.tryCatch(
        () => {
          return this.model.findOne({ address, chain }).exec();
        },
        (err: unknown) => new DatabaseError(err),
      ),
      TE.chain((tokenEntity) => {
        return this.saveMarketDataEntity(tokenEntity._id, entry);
      }),
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
  protected abstract getPaths(): Array<Omit<keyof F, 'contract'>>;

  protected saveChildren(token: HydratedDocument<E>): Promise<unknown> {
    return Promise.all(
      token.marketData.map((entry) =>
        this.saveMarketDataEntity(token._id, entry)(),
      ),
    );
  }

  private saveMarketDataEntity(
    parentId: Types.ObjectId,
    entry: MarketData,
  ): TE.TaskEither<DatabaseError, MarketData> {
    return TE.tryCatch(
      () => {
        return this.marketModel
          .findOneAndUpdate(
            {
              tokenId: parentId,
              timestamp: entry.timestamp,
            },
            entry,
            {
              upsert: true,
              new: true,
            },
          )
          .exec();
      },
      (err: unknown) => new DatabaseError(err),
    );
  }
}
