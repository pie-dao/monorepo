import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';
import { nullable, optional } from './codecs';

export const marketDataCodec = t.strict({
  current_price: withMessage(
    t.record(t.string, t.number),
    () => 'current price is missing',
  ),
  market_cap: withMessage(
    t.record(t.string, t.number),
    () => 'market cap is missing',
  ),
  market_cap_rank: nullable(t.number),
  total_volume: withMessage(
    t.record(t.string, t.number),
    () => 'total volume is missing',
  ),
  // total_value_locked: withMessage(
  //   t.record(t.string, t.number),
  //   () => 'tvl is missing',
  // ),
  circulating_supply: withMessage(
    t.number,
    () => 'circulating supply is missing',
  ),
  last_updated: withMessage(t.string, () => 'last updated is missing'),
  // 👇 We don't load these right now
  // mcap_to_tvl_ratio: nullable(t.number),
  // fdv_to_tvl_ratio: nullable(t.number),
  // roi: nullable(
  //   t.strict({
  //     times: withMessage(t.number, () => 'roi times is missing'),
  //     currency: withMessage(t.string, () => 'roi currency is missing'),
  //     percentage: withMessage(t.number, () => 'roi percentage is missing'),
  //   }),
  // ),
  ath: nullable(t.record(t.string, t.number)),
  // ath_change_percentage: withMessage(
  //   t.record(t.string, t.number),
  //   () => 'ath change percentage is missing',
  // ),
  // ath_date: withMessage(
  //   t.record(t.string, t.string),
  //   () => 'ath date is missing',
  // ),
  atl: nullable(t.record(t.string, t.number)),
  // atl_change_percentage: withMessage(
  //   t.record(t.string, t.number),
  //   () => 'atl change percentage is missing',
  // ),
  // atl_date: withMessage(
  //   t.record(t.string, t.string),
  //   () => 'atl date is missing',
  // ),
  // fully_diluted_valuation: withMessage(
  //   t.record(t.string, t.number),
  //   () => 'fully diluted valuation is missing',
  // ),
  // high_24h: nullable(t.record(t.string, t.number)),
  // low_24h: nullable(t.record(t.string, t.number)),
  // price_change_24h: nullable(t.number),
  // price_change_percentage_24h: nullable(t.number),
  // price_change_percentage_7d: nullable(t.number),
  // price_change_percentage_14d: nullable(t.number),
  // price_change_percentage_30d: nullable(t.number),
  // price_change_percentage_60d: nullable(t.number),
  // price_change_percentage_200d: nullable(t.number),
  // price_change_percentage_1y: nullable(t.number),
  // market_cap_change_24h: nullable(t.number),
  // market_cap_change_percentage_24h: nullable(t.number),
  price_change_24h_in_currency: nullable(t.record(t.string, t.number)),
  // price_change_percentage_1h_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  price_change_percentage_24h_in_currency: nullable(
    t.record(t.string, t.number),
  ),
  // price_change_percentage_7d_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // price_change_percentage_14d_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // price_change_percentage_30d_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // price_change_percentage_60d_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // price_change_percentage_200d_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // price_change_percentage_1y_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  // market_cap_change_24h_in_currency: nullable(t.record(t.string, t.number)),
  // market_cap_change_percentage_24h_in_currency: nullable(
  //   t.record(t.string, t.number),
  // ),
  total_supply: nullable(t.number),
  // max_supply: nullable(t.number),
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
  market_cap_rank: nullable(t.number),
  coingecko_rank: withMessage(t.number, () => 'coingecko rank is missing'),
  coingecko_score: withMessage(t.number, () => 'coingecko score is missing'),
  developer_score: withMessage(t.number, () => 'developer score is missing'),
  community_score: withMessage(t.number, () => 'community score is missing'),
  liquidity_score: withMessage(t.number, () => 'liquidity score is missing'),
  market_data: withMessage(marketDataCodec, () => 'market data is missing'),
  last_updated: withMessage(t.string, () => 'last updated is missing'),
  // 👇 things we don't load right now
  // asset_platform_id
  // block_time_in_minutes
  // hashing_algorithm
  // categories
  // public_notice
  // additional_notices
  // localization
  // description
  // links
  // image
  // country_origin
  // genesis_date
  // sentiment_votes_up_percentage
  // sentiment_votes_down_percentage
  // ico_data
  // community_data
  // developer_data
  // public_interest_stats
  // status_updates
  // tickers
  // public_interest_score
  // 👆
});

export type CoinMetadataDto = t.TypeOf<typeof coinMetadataCodec>;
