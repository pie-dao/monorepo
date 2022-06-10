import { DataTransferError, get } from '@hexworks/cobalt-http';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import moment from 'moment';
import {
  coinHistoryCodec,
  CoinHistoryDto,
  coinMetadataCodec,
  CoinMetadataDto,
  MarketDto,
  marketsCodec,
  ohlcCodec,
  OhlcDto,
} from '.';
import { CoinSummary, SupportedCurrency, SupportedDays } from '..';

const BASE_URL = 'https://api.coingecko.com/api/v3';
export const DEFAULT_PIES: CoinSummary[] = [
  {
    id: 'piedao-balanced-crypto-pie',
    symbol: 'bcp',
    name: 'PieDAO Balanced Crypto Pie',
  },
  { id: 'piedao-btc', symbol: 'btc++', name: 'PieDAO BTC++' },
  { id: 'piedao-defi', symbol: 'defi++', name: 'PieDAO DEFI++' },
  {
    id: 'piedao-defi-large-cap',
    symbol: 'defi+l',
    name: 'PieDAO DEFI Large Cap',
  },
  {
    id: 'piedao-defi-small-cap',
    symbol: 'defi+s',
    name: 'PieDAO DEFI Small Cap',
  },
  { id: 'piedao-dough-v2', symbol: 'dough', name: 'PieDAO DOUGH v2' },
  {
    id: 'piedao-yearn-ecosystem-pie',
    symbol: 'ypie',
    name: 'PieDAO Yearn Ecosystem Pie',
  },
];

export class CoinGeckoAdapter {
  private pieIds: string;

  constructor(coins: CoinSummary[] = DEFAULT_PIES) {
    this.pieIds = coins.map((it) => it.id).join(',');
  }

  public getMarkets(
    vsCurrency: SupportedCurrency = 'usd',
  ): TE.TaskEither<DataTransferError, MarketDto[]> {
    return get(`${BASE_URL}/coins/markets`, marketsCodec, {
      params: {
        vs_currency: vsCurrency,
        ids: this.pieIds,
        price_change_percentage: '1h,24h,7d',
      },
    });
  }

  public getCoinMetadata(
    coinId: string,
  ): TE.TaskEither<DataTransferError, CoinMetadataDto> {
    return get(`${BASE_URL}/coins/${coinId}`, coinMetadataCodec, {
      params: {
        localization: true,
        tickers: true,
        market_data: true,
        community_data: true,
        developer_data: true,
      },
    });
  }

  public getCoinHistory(
    coinId: string,
    date: Date,
  ): TE.TaskEither<DataTransferError, CoinHistoryDto> {
    return get(`${BASE_URL}/coins/${coinId}/history`, coinHistoryCodec, {
      params: {
        date: moment(date).format('DD-MM-YYYY'),
        localization: false,
      },
    });
  }

  public getOhlc({
    coinId,
    vsCurrency,
    days,
  }: {
    coinId: string;
    vsCurrency: SupportedCurrency;
    days: SupportedDays;
  }): TE.TaskEither<DataTransferError, OhlcDto[]> {
    return get(`${BASE_URL}/coins/${coinId}/ohlc`, t.array(ohlcCodec), {
      params: {
        vs_currency: vsCurrency,
        days,
      },
    });
  }
}
