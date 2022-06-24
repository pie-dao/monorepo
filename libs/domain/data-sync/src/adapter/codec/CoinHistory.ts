import * as t from 'io-ts';
import { withMessage } from 'io-ts-types';

export const coinHistoryCodec = t.strict({
  id: withMessage(t.string, () => 'id is missing'),
  symbol: withMessage(t.string, () => 'symbol is missing'),
  name: withMessage(t.string, () => 'name is missing'),
  // `localization` is not included
  // `image` is not included
  market_data: t.strict({
    current_price: withMessage(
      t.record(t.string, t.number),
      () => 'current price is missing',
    ),
    market_cap: withMessage(
      t.record(t.string, t.number),
      () => 'market cap is missing',
    ),
    total_volume: withMessage(
      t.record(t.string, t.number),
      () => 'total volume is missing',
    ),
  }),
  // `community_data` is not included
  // `developer_data` is not included
  // `public_interest_stats` is not included
});

export type CoinHistoryDto = t.TypeOf<typeof coinHistoryCodec>;
