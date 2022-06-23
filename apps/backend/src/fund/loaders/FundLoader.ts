import { CoinGeckoAdapter, DEFAULT_FUNDS } from '@domain/data-sync';
import {
  CurrencyData,
  DatabaseError,
  SupportedCurrency,
  Token,
  TokenNotFoundError,
} from '@domain/feature-funds';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { check } from '@shared/helpers';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { TokenModel } from '../repository/entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';

const THIRTY_MINUTES = 1000 * 60 * 30;

export class MissingDataError extends Error {
  public kind: 'MissingDataError' = 'MissingDataError';
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class FundLoader {
  private sentry: ReturnType<SentryService['instance']>;

  constructor(
    private tokenRepository: MongoTokenRepository,
    private coinGeckoAdapter: CoinGeckoAdapter,
    @InjectSentry()
    private sentryService: SentryService,
  ) {
    this.sentry = this.sentryService.instance();
  }

  @Interval(THIRTY_MINUTES)
  public loadCgMarketData() {
    Logger.log('Loading CG market data...');
    return pipe(
      this.ensureFundsExist(),
      TE.chainW(
        TE.traverseArray((fund) => {
          return pipe(
            TE.Do,
            TE.bind('fund', () => TE.of(fund)),
            TE.bind('metadata', () =>
              this.coinGeckoAdapter.getCoinMetadata(fund.coinGeckoId),
            ),
          );
        }),
      ),
      TE.chainW(
        TE.traverseArray(({ fund, metadata }) => {
          const currencyDataLookup = new Map<SupportedCurrency, CurrencyData>();

          Object.entries(metadata.market_data.current_price).forEach(
            ([currency, amount]) => {
              currencyDataLookup.set(currency as SupportedCurrency, {
                currency: currency as SupportedCurrency,
                price: amount,
                marketCap: 0,
                volume: 0,
              });
            },
          );
          Object.entries(metadata.market_data.market_cap).forEach(
            ([currency, amount]) => {
              currencyDataLookup.get(currency as SupportedCurrency).marketCap =
                amount;
            },
          );
          Object.entries(metadata.market_data.total_volume).forEach(
            ([currency, amount]) => {
              currencyDataLookup.get(currency as SupportedCurrency).volume =
                amount;
            },
          );
          const currencyData = Array.from(currencyDataLookup.values());
          const marketCapRank = metadata.market_data.market_cap_rank;
          const circulatingSupply = metadata.market_data.circulating_supply;
          const timestamp = new Date(Date.parse(metadata.last_updated));

          return this.tokenRepository.addMarketData(fund.chain, fund.address, {
            currencyData,
            marketCapRank,
            circulatingSupply,
            timestamp,
          });
        }),
      ),
      TE.bimap(
        (error) => {
          this.sentry.captureException(error);
          Logger.error(error);
          return error;
        },
        (result) => {
          Logger.log('CG market data loaded successfully.');
          return result;
        },
      ),
    )();
  }

  /**
   * This method makes sure that all the `DEFAULT_FUNDS` are in the database
   * using an upsert operation.
   */
  public ensureFundsExist(): TE.TaskEither<
    DatabaseError | TokenNotFoundError,
    readonly Token[]
  > {
    return pipe(
      DEFAULT_FUNDS,
      A.map((fund) => {
        return TE.tryCatch(
          () => {
            check(fund.coingeckoId.length > 0, `coingeckoId can't be empty`);
            return TokenModel.findOneAndUpdate(
              {
                address: fund.address,
                chain: fund.chain,
              },
              {
                chain: fund.chain,
                address: fund.address,
                name: fund.name,
                symbol: fund.symbol,
                decimals: fund.decimals,
                kind: fund.kind,
                coinGeckoId: fund.coingeckoId,
              },
              {
                upsert: true,
                new: true,
              },
            ).exec();
          },
          (err: unknown) => new DatabaseError(err),
        );
      }),
      TE.sequenceArray,
      TE.chain(
        TE.traverseArray((fund) => {
          return this.tokenRepository.findOne(fund.chain, fund.address);
        }),
      ),
    );
  }
}
