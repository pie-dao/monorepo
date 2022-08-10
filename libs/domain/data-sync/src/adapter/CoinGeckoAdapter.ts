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
import { SupportedDays } from '..';
import { SupportedChain, SupportedCurrency } from '@shared/util-types';
import { tokenPricesCodec, TokenPricesDto } from './codec/TokenPrices';
import { pipe } from 'fp-ts/lib/function';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const DEFAULT_FUNDS = [
  {
    symbol: 'play',
    name: 'Metaverse NFT Index',
    address: '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
    coingeckoId: 'metaverse-nft-index',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
    decimals: 18,
  },
  // {
  //   symbol: 'btc++',
  //   name: 'PieDAO BTC++',
  //   address: '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
  //   coingeckoId: 'piedao-btc',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieVault',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'defi+s',
  //   name: 'PieDAO DEFI Small Cap',
  //   address: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
  //   coingeckoId: 'piedao-defi-small-cap',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieVault',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'defi++',
  //   name: 'PieDAO DEFI++',
  //   address: '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
  //   coingeckoId: 'piedao-defi',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieVault',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'bcp',
  //   name: 'PieDAO Balanced Crypto Pie',
  //   address: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
  //   coingeckoId: 'piedao-balanced-crypto-pie',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieSmartPool',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'ypie',
  //   name: 'PieDAO Yearn Ecosystem Pie',
  //   address: '0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31',
  //   coingeckoId: 'piedao-yearn-ecosystem-pie',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieVault',
  //   decimals: 18,
  // },
  // {
  //   symbol: 'defi+l',
  //   name: 'PieDAO DEFI Large Cap',
  //   address: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
  //   coingeckoId: 'piedao-defi-large-cap',
  //   chain: SupportedChain.ETHEREUM,
  //   kind: 'PieVault',
  //   decimals: 18,
  // },
];

export type CoinSummary = typeof DEFAULT_FUNDS[0];

export class CoinGeckoAdapter {
  private pieIds: string;

  constructor(coins: CoinSummary[] = DEFAULT_FUNDS) {
    this.pieIds = coins.map((it) => it.coingeckoId).join(',');
  }

  public getPrices(
    addresses: string[],
    vsCurrency: SupportedCurrency = 'usd',
  ): TE.TaskEither<DataTransferError, TokenPricesDto> {
    return pipe(
      get(`${BASE_URL}/simple/token_price/ethereum`, tokenPricesCodec, {
        params: {
          contract_addresses: addresses.join(','),
          vs_currencies: vsCurrency,
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
      }),
      TE.map((prices) => {
        const result: TokenPricesDto = {};
        Object.keys(prices).forEach((key) => {
          result[key.toLowerCase()] = prices[key];
        });
        return result;
      }),
    );
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
}
