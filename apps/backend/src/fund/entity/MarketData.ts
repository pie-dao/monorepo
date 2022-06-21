import {
  CurrencyAmount,
  MarketData,
  SupportedCurrency,
} from '@domain/feature-funds';
import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class CurrencyAmountEntity implements CurrencyAmount {
  @prop({ required: true, type: String })
  currency: SupportedCurrency;
  @prop({ required: true })
  amount: number;
}

@modelOptions({
  schemaOptions: { collection: 'tokenmarketdata' },
})
@index({ tokenId: 1, timestamp: 1 }, { unique: true })
export class MarketDataEntity implements MarketData {
  @prop({ required: true, index: true })
  public tokenId: Types.ObjectId;
  @prop({ required: true, type: CurrencyAmountEntity, _id: false })
  currentPrice: Array<CurrencyAmountEntity>;
  @prop({ required: true, type: CurrencyAmountEntity, _id: false })
  marketCap: Array<CurrencyAmountEntity>;
  @prop({ required: true, type: CurrencyAmountEntity, _id: false })
  totalVolume: Array<CurrencyAmountEntity>;
  @prop({ required: true })
  marketCapRank: number;
  @prop({ required: true })
  circulatingSupply: number;
  @prop({ required: true, index: true })
  timestamp: Date;
}

export const MarketDataModel = getModelForClass(MarketDataEntity);
