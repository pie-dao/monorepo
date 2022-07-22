import { PieSmartPoolHistory, TokenWeight } from '@domain/feature-funds';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { Types } from 'mongoose';
import { BigNumberType } from '../../BigNumberType';
import { HistoryEntityBase } from '../base';
import { DiscriminatedTokenEntity, DiscriminatedTokenModel } from '../Token';

export class TokenWeightEntity implements TokenWeight {
  @prop({ required: true })
  token: DiscriminatedTokenEntity;
  @prop({ type: BigNumberType, required: true })
  weight: BigNumber;
}

@modelOptions({
  schemaOptions: { collection: 'piesmartpoolhistory' },
})
export class PieSmartPoolHistoryEntity
  extends HistoryEntityBase
  implements PieSmartPoolHistory
{
  @prop({ type: DiscriminatedTokenEntity, required: true, _id: false })
  underlyingTokens: Types.Array<DiscriminatedTokenEntity>;

  @prop({ required: true })
  controller: string;

  @prop({ required: true })
  publicSwapSetter: string;

  @prop({ required: true })
  tokenBinder: string;

  @prop({ required: true })
  circuitBreaker: string;

  @prop({ required: true })
  publicSwapEnabled: boolean;

  @prop({ type: BigNumberType, required: true })
  cap: BigNumber;

  @prop({ type: BigNumberType, required: true })
  annualFee: BigNumber;

  @prop({ required: true })
  feeRecipient: string;

  @prop({ required: true })
  balancerPoolAddress: string;

  @prop({ type: BigNumberType, required: true })
  swapFee: BigNumber;

  @prop({ type: TokenWeightEntity, _id: false, default: [] })
  denormalizedWeights: Types.Array<TokenWeightEntity>;

  @prop({ type: TokenWeightEntity, _id: false, default: [] })
  targetWeights: Types.Array<TokenWeightEntity>;

  @prop({ type: TokenWeightEntity, _id: false, default: [] })
  startWeights: Types.Array<TokenWeightEntity>;

  @prop({ type: BigNumberType })
  startBlock?: BigNumber;

  @prop({ type: BigNumberType })
  endBlock?: BigNumber;

  @prop({ required: true })
  joinExitEnabled: boolean;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class PieSmartPoolEntity extends DiscriminatedTokenEntity {
  @prop({
    ref: () => PieSmartPoolHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
    default: [],
  })
  history: PieSmartPoolHistoryEntity[];
}

export const PieSmartPoolModel = getDiscriminatorModelForClass(
  DiscriminatedTokenModel,
  PieSmartPoolEntity,
  'PieSmartPool',
);

export const PieSmartPoolHistoryModel = getModelForClass(
  PieSmartPoolHistoryEntity,
);
