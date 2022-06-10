import * as t from 'io-ts';

/**
 * Tuple of:
 * timestamp: Date;
 * open: number;
 * high: number;
 * low: number;
 * close: number;
 */
export const ohlcCodec = t.tuple([
  t.number,
  t.number,
  t.number,
  t.number,
  t.number,
]);

export type OhlcDto = t.TypeOf<typeof ohlcCodec>;
