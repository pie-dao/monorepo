import { CoinGeckoAdapter } from '@domain/data-sync';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { pipe } from 'fp-ts/lib/function';

const EVERY_10_SECONDS = 1000 * 10;

@Injectable()
export class FundLoader {
  constructor(private coinGeckoAdapter: CoinGeckoAdapter) {}

  @Interval(EVERY_10_SECONDS)
  async loadPies() {
    Logger.log('=== Hello ===');
  }

  private ensureFundsExist() {
    pipe(this.coinGeckoAdapter.getMarkets());
  }
}
