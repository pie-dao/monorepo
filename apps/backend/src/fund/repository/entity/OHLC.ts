import { OHLC } from '@domain/feature-funds';
import { index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { SupportedCurrency } from '@shared/util-types';
@modelOptions({
  schemaOptions: { collection: 'ohlc' },
})
@index({ currency: 1, from: 1, to: 1 }, { unique: true })
export class OHLCEntity implements OHLC {
  @prop({ required: true, index: true })
  public tokenId: Types.ObjectId;

  @prop({ required: true })
  open: number;

  @prop({ required: true })
  high: number;

  @prop({ required: true })
  low: number;

  @prop({ required: true })
  close: number;

  @prop({ required: true, type: String, index: true })
  currency: SupportedCurrency;

  @prop({ required: true, index: true })
  from: Date;

  @prop({ required: true, index: true })
  to: Date;
}
