import { OHLC, TokenMarketData } from '@domain/feature-funds';
import { modelOptions, prop } from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { Types } from 'mongoose';
import { BigNumberType } from '..';
import { TemporalEntity } from './base/TemporalEntity';

export class OHLCEntity implements OHLC {
  @prop({ required: true, type: BigNumberType })
  open: BigNumber;
  @prop({ required: true, type: BigNumberType })
  high: BigNumber;
  @prop({ required: true, type: BigNumberType })
  low: BigNumber;
  @prop({ required: true, type: BigNumberType })
  close: BigNumber;
}

@modelOptions({
  schemaOptions: { collection: 'tokenmarketdata' },
})
export class TokenMarketDataEntity
  extends TemporalEntity
  implements TokenMarketData
{
  @prop({ required: true, index: true })
  public tokenId: Types.ObjectId;
  @prop({ required: true, type: BigNumberType })
  currentPrice: BigNumber;
  @prop({ required: true, type: BigNumberType })
  marketCap: BigNumber;
  @prop({ required: true })
  marketCapRank: number;
  @prop({ required: true, type: BigNumberType })
  totalVolume: BigNumber;
  @prop({ required: true, type: BigNumberType })
  circulatingSupply: BigNumber;
  @prop({ required: true, type: BigNumberType })
  tvl: BigNumber;
  @prop({ type: OHLCEntity, default: [], _id: false })
  ohlc: Types.Array<OHLCEntity>;
}
