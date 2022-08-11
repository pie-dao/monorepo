import { CurrencyData, MarketData } from '@domain/feature-funds';
import { SupportedCurrency } from '@shared/util-types';
import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class CurrencyDataEntity implements CurrencyData {
  @prop({ required: true, type: String })
  currency: SupportedCurrency;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  marketCap: number;

  @prop({ required: true })
  volume: number;

  @prop({ required: true })
  nav: number;

  @prop()
  priceChange24h?: number;

  @prop()
  priceChangePercentage24h?: number;

  @prop()
  ath?: number;

  @prop()
  atl?: number;
}

@modelOptions({
  schemaOptions: { collection: 'tokenmarketdata' },
})
@index({ tokenId: 1, timestamp: 1 }, { unique: true })
export class MarketDataEntity implements MarketData {
  @prop({ required: true, index: true })
  public tokenId: Types.ObjectId;

  @prop({ required: true, type: CurrencyDataEntity, _id: false })
  currencyData: Array<CurrencyDataEntity>;

  @prop({ required: true })
  marketCapRank: number;

  @prop({ required: true })
  circulatingSupply: number;

  @prop({ required: true, index: true })
  timestamp: Date;
}

export const MarketDataModel = getModelForClass(MarketDataEntity);
