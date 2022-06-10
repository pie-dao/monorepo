import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';
import { nullable, optional } from './codecs';

export const marketDataCodec = t.strict({
  current_price: nullable(t.record(t.string, t.number)),
  total_value_locked: nullable(t.number),
  mcap_to_tvl_ratio: nullable(t.number),
  fdv_to_tvl_ratio: nullable(t.number),
  roi: nullable(
    t.strict({
      times: withMessage(t.number, () => 'roi times is missing'),
      currency: withMessage(t.string, () => 'roi currency is missing'),
      percentage: withMessage(t.number, () => 'roi percentage is missing'),
    }),
  ),
  ath: withMessage(t.record(t.string, t.number), () => 'ath is missing'),
  ath_change_percentage: withMessage(
    t.record(t.string, t.number),
    () => 'ath change percentage is missing',
  ),
  ath_date: withMessage(
    t.record(t.string, t.string),
    () => 'ath date is missing',
  ),
  atl: withMessage(t.record(t.string, t.number), () => 'atl is missing'),
  atl_change_percentage: withMessage(
    t.record(t.string, t.number),
    () => 'atl change percentage is missing',
  ),
  atl_date: withMessage(
    t.record(t.string, t.string),
    () => 'atl date is missing',
  ),
  market_cap: withMessage(
    t.record(t.string, t.number),
    () => 'market cap is missing',
  ),
  market_cap_rank: withMessage(t.number, () => 'market cap rank is missing'),
  fully_diluted_valuation: withMessage(
    t.record(t.string, t.number),
    () => 'fully diluted valuation is missing',
  ),
  total_volume: withMessage(
    t.record(t.string, t.number),
    () => 'total volume is missing',
  ),
  high_24h: withMessage(
    t.record(t.string, t.number),
    () => 'high 24h is missing',
  ),
  low_24h: withMessage(
    t.record(t.string, t.number),
    () => 'low 24h is missing',
  ),
  price_change_24h: nullable(t.number),
  price_change_percentage_24h: nullable(t.number),
  price_change_percentage_7d: nullable(t.number),
  price_change_percentage_14d: nullable(t.number),
  price_change_percentage_30d: nullable(t.number),
  price_change_percentage_60d: nullable(t.number),
  price_change_percentage_200d: nullable(t.number),
  price_change_percentage_1y: nullable(t.number),
  market_cap_change_24h: nullable(t.number),
  market_cap_change_percentage_24h: nullable(t.number),
  price_change_24h_in_currency: nullable(t.record(t.string, t.number)),
  price_change_percentage_1h_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_24h_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_7d_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_14d_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_30d_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_60d_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_200d_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  price_change_percentage_1y_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  market_cap_change_24h_in_currency: nullable(t.record(t.string, t.number)),
  market_cap_change_percentage_24h_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  total_supply: nullable(t.number),
  max_supply: nullable(t.number),
  circulating_supply: withMessage(
    t.number,
    () => 'circulating supply is missing',
  ),
  last_updated: withMessage(t.string, () => 'last updated is missing'),
});

export type MarketDataDto = t.TypeOf<typeof marketDataCodec>;

export const tickerCodec = t.strict({
  base: withMessage(t.string, () => 'base is missing'),
  target: withMessage(t.string, () => 'target is missing'),
  market: withMessage(
    t.strict({
      name: withMessage(t.string, () => 'market name is missing'),
      identifier: withMessage(t.string, () => 'market id is missing'),
      has_trading_incentive: withMessage(
        t.boolean,
        () => 'market trading incentive is missing',
      ),
    }),
    () => 'market is missing',
  ),
  last: withMessage(t.number, () => 'last is missing'),
  volume: withMessage(t.number, () => 'volume is missing'),
  converted_last: withMessage(
    t.record(t.string, t.number),
    () => 'convered last is missing',
  ),
  converted_volume: withMessage(
    t.record(t.string, t.number),
    () => 'converted volume is missing',
  ),
  trust_score: withMessage(t.string, () => 'trust score is missing'),
  bid_ask_spread_percentage: withMessage(
    t.number,
    () => 'bid ask spread percentage is missing',
  ),
  timestamp: withMessage(t.string, () => 'timestamp is missing'),
  last_traded_at: withMessage(t.string, () => 'last traded at is missing'),
  last_fetch_at: withMessage(t.string, () => 'last fetch at is missing'),
  is_anomaly: withMessage(t.boolean, () => 'is anomaly is missing'),
  is_stale: withMessage(t.boolean, () => 'is stale is missing'),
  trade_url: nullable(t.string),
  token_info_url: nullable(t.string),
  coin_id: withMessage(t.string, () => 'coin id is missing'),
  target_coin_id: optional(t.string),
});

export type TickerDto = t.TypeOf<typeof tickerCodec>;

export const coinMetadataCodec = t.strict({
  id: withMessage(t.string, () => 'id is missing'),
  symbol: withMessage(t.string, () => 'symbol is missing'),
  name: withMessage(t.string, () => 'name is missing'),
  asset_platform_id: nullable(t.string),
  block_time_in_minutes: nullable(t.number),
  hashing_algorithm: nullable(t.string),
  categories: t.array(nullable(t.string)),
  public_notice: nullable(t.string),
  additional_notices: t.array(t.string),
  localization: t.record(t.string, t.string),
  description: t.record(t.string, t.string),
  // `links` is not loaded
  image: withMessage(
    t.strict({
      thumb: withMessage(t.string, () => 'thumb image is missing'),
      small: withMessage(t.string, () => 'small image is missing'),
      large: withMessage(t.string, () => 'large image is missing'),
    }),
    () => 'image info is missing',
  ),
  country_origin: withMessage(t.string, () => 'country origin is missing'),
  genesis_date: nullable(t.string),
  sentiment_votes_up_percentage: nullable(t.number),
  sentiment_votes_down_percentage: nullable(t.number),
  // `ico_data` is not loaded
  market_cap_rank: withMessage(t.number, () => 'market cap rank is missing'),
  coingecko_rank: withMessage(t.number, () => 'coingecko rank is missing'),
  coingecko_score: withMessage(t.number, () => 'coingecko score is missing'),
  developer_score: withMessage(t.number, () => 'developer score is missing'),
  community_score: withMessage(t.number, () => 'community score is missing'),
  liquidity_score: withMessage(t.number, () => 'liquidity score is missing'),
  public_interest_score: withMessage(
    t.number,
    () => 'public interest score is missing',
  ),
  market_data: nullable(marketDataCodec),
  // `community_data` is not loaded
  // `developer_data` is not loaded
  // `public_interest_stats` is not loaded
  // `status_updates` is not loaded
  last_updated: withMessage(t.string, () => 'last updated is missing'),
  tickers: nullable(t.array(tickerCodec)),
});

export type CoinMetadataDto = t.TypeOf<typeof coinMetadataCodec>;
