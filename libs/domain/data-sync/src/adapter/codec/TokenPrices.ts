import * as t from 'io-ts';

export const tokenPricesCodec = t.record(
  t.string,
  t.strict({
    usd: t.number,
    // usd_market_cap: t.number,
    // usd_24h_vol: t.number,
    // usd_24h_change: t.number,
  }),
);

export type TokenPricesDto = t.TypeOf<typeof tokenPricesCodec>;
