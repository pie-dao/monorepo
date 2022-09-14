import * as t from 'io-ts';
import { nullable } from './codecs';

export const TokenContractCodec = t.type({
  data: t.type({
    erc20Contract: t.type({
      id: t.string,
      getSwapFee: nullable(t.string),
      getAnnualFee: t.string,
    }),
  }),
});

export type TokenContractDto = t.TypeOf<typeof TokenContractCodec>;
