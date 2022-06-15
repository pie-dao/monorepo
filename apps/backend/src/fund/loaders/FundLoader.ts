import { CoinGeckoAdapter, DEFAULT_FUNDS } from '@domain/data-sync';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { TokenEntity, TokenModel } from '../entity';

const EVERY_10_SECONDS = 1000 * 10;

@Injectable()
export class FundLoader {
  constructor(private coinGeckoAdapter: CoinGeckoAdapter) {}

  @Interval(EVERY_10_SECONDS)
  async loadPies() {
    Logger.log('=== Hello ===');
    const result = await this.ensureFundsExist()();

    console.log(result);
  }

  private ensureFundsExist() {
    return pipe(
      DEFAULT_FUNDS,
      A.map((fund) => {
        return () =>
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
            },
          ).exec() as Promise<TokenEntity>;
      }),
      T.sequenceArray,
    );
  }
}
