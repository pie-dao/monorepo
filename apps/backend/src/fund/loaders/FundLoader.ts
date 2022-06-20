import { CoinGeckoAdapter, DEFAULT_FUNDS } from '@domain/data-sync';
import {
  DatabaseError,
  Token,
  TokenNotFoundError,
} from '@domain/feature-funds';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import BigNumber from 'bignumber.js';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { TokenModel } from '../entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';

const EVERY_10_SECONDS = 1000 * 10;
const THIRTY_MINUTES = 1000 * 60 * 30;
export class MissingDataError extends Error {
  public kind: 'MissingDataError' = 'MissingDataError';
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class FundLoader {
  constructor(
    private tokenRepository: MongoTokenRepository,
    private coinGeckoAdapter: CoinGeckoAdapter,
  ) {}

  @Interval(EVERY_10_SECONDS)
  loadCurrentCGData() {
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
            TE.bind('ohlc', () =>
              this.coinGeckoAdapter.getOhlc({
                coinId: fund.coinGeckoId,
                vsCurrency: 'usd',
                days: '1',
              }),
            ),
          );
        }),
      ),
      TE.chainW(
        TE.traverseArray(({ fund, ohlc, metadata }) => {
          const currentPrice =
            metadata.market_data?.current_price?.usd ??
            this.throwError('Missing current price');
          const marketCap =
            metadata.market_data?.market_cap?.usd ??
            this.throwError('Missing market cap');
          const marketCapRank =
            metadata.market_data?.market_cap_rank ??
            this.throwError('Missing market cap rank');
          const totalVolume =
            metadata.market_data?.total_volume?.usd ??
            this.throwError('Missing total volume');
          const circulatingSupply =
            metadata?.market_data?.circulating_supply ??
            this.throwError('Missing circulating supply');
          const tvl =
            metadata?.market_data?.total_value_locked ??
            this.throwError('Missing total value locked');
          const timestamp =
            new Date(Date.parse(metadata.last_updated)) ??
            this.throwError('Missing timestamp');

          return this.tokenRepository.addMarketData(fund.chain, fund.address, {
            currentPrice: new BigNumber(currentPrice),
            marketCap: new BigNumber(marketCap),
            marketCapRank,
            totalVolume: new BigNumber(totalVolume),
            circulatingSupply: new BigNumber(circulatingSupply),
            tvl: new BigNumber(tvl),
            timestamp,
            ohlc: ohlc.map(([ts, open, high, low, close]) => ({
              open: new BigNumber(open),
              high: new BigNumber(high),
              low: new BigNumber(low),
              close: new BigNumber(close),
              from: new Date(ts - THIRTY_MINUTES),
              to: new Date(ts),
            })),
          });
        }),
      ),
      TE.match(
        (err) => {
          Logger.error(err);
        },
        () => {
          return;
        },
      ),
    )();
  }

  private throwError(message: string): never {
    throw new MissingDataError(message);
  }

  public ensureFundsExist(): TE.TaskEither<
    DatabaseError | TokenNotFoundError,
    readonly Token[]
  > {
    return pipe(
      DEFAULT_FUNDS,
      A.map((fund) => {
        return TE.tryCatch(
          () =>
            TokenModel.findOneAndUpdate(
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
            ).exec(),
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
