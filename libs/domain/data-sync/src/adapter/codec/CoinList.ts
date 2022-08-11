import * as t from 'io-ts';
import { nullable } from './codecs';

export const coinListCodec = t.array(
  t.strict({
    id: t.string,
    symbol: t.string,
    name: t.string,
    platforms: t.record(t.string, nullable(t.string)),
  }),
);

export type CoinListDto = t.TypeOf<typeof coinListCodec>;
