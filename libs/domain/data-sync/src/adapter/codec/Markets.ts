import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';
import { nullable } from './codecs';

export const marketCodec = t.strict({
  id: withMessage(t.string, () => 'id is missing'),
  symbol: withMessage(t.string, () => 'symbol is missing'),
  name: withMessage(t.string, () => 'name is missing'),
  image: withMessage(t.string, () => 'image is missing'),
  current_price: withMessage(t.number, () => 'current price is missing'),
  market_cap: withMessage(t.number, () => 'market cap is missing'),
  market_cap_rank: nullable(t.number),
  fully_diluted_valuation: nullable(t.number),
  total_volume: withMessage(t.number, () => 'total volume is missing'),
  high_24h: nullable(t.number),
  low_24h: nullable(t.number),
  price_change_24h: nullable(t.number),
  price_change_percentage_24h: nullable(t.number),
  market_cap_change_24h: nullable(t.number),
  market_cap_change_percentage_24h: nullable(t.number),
  circulating_supply: withMessage(
    t.number,
    () => 'circulating supply is missing',
  ),
  total_supply: nullable(t.number),
  max_supply: nullable(t.number),
  ath: withMessage(t.number, () => 'ath is missing'),
  ath_change_percentage: withMessage(
    t.number,
    () => 'ath change percentage is missing',
  ),
  ath_date: withMessage(t.string, () => 'ath date is missing'),
  atl: withMessage(t.number, () => 'atl is missing'),
  atl_change_percentage: withMessage(
    t.number,
    () => 'atl change percentage is missing',
  ),
  atl_date: withMessage(t.string, () => 'atl date is missing'),
  roi: nullable(
    t.strict({
      times: nullable(t.number),
      currency: withMessage(t.string, () => 'currency is missing'),
      percentage: nullable(t.number),
    }),
  ),
  last_updated: withMessage(t.string, () => 'last updated is missing'),
  price_change_percentage_1h_in_currency: nullable(t.number),
  price_change_percentage_24h_in_currency: nullable(t.number),
});

export type MarketDto = t.TypeOf<typeof marketCodec>;

export const marketsCodec = t.array(marketCodec);
