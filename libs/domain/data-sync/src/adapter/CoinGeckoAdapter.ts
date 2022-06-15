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
import { SupportedCurrency, SupportedDays } from '..';
import { SupportedChain } from '@shared/util-chain';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const DEFAULT_PIES = [
  {
    symbol: 'BTC++',
    name: 'PieDAO BTC++',
    address: '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd',
    coingeckoId: 'piedao-btc',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'DEFI+S',
    name: 'PieDAO DEFI Small Cap',
    address: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
    coingeckoId: 'piedao-defi-small-cap',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'DEFI++',
    name: 'PieDAO DEFI++',
    address: '0x8d1ce361eb68e9e05573443c407d4a3bed23b033',
    coingeckoId: 'piedao-defi',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'BCP',
    name: 'PieDAO Balanced Crypto Pie',
    address: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
    coingeckoId: 'piedao-balanced-crypto-pie',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieSmartPool',
  },
  {
    symbol: 'YPIE',
    name: 'PieDAO Yearn Ecosystem Pie',
    address: '0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31',
    coingeckoId: 'piedao-yearn-ecosystem-pie',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'PLAY',
    name: 'Metaverse NFT Index',
    address: '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4',
    coingeckoId: 'metaverse-nft-index',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'DEFI+L',
    name: 'PieDAO DEFI Large Cap',
    address: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
    coingeckoId: 'piedao-defi-large-cap',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'DEFI+L',
    name: 'PieDAO DEFI Large Cap',
    address: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
    coingeckoId: 'piedao-defi-large-cap',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
  {
    symbol: 'USD++',
    name: 'USD Index Pie',
    address: '0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e',
    coingeckoId: '',
    chain: SupportedChain.ETHEREUM,
    kind: 'PieVault',
  },
];

export type CoinSummary = typeof DEFAULT_PIES[0];

export class CoinGeckoAdapter {
  private pieIds: string;

  constructor(coins: CoinSummary[] = DEFAULT_PIES) {
    this.pieIds = coins.map((it) => it.coingeckoId).join(',');
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
