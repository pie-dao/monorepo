import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { BigNumberType } from 'mongoose-bignumber';
import { HistoryEntityBase } from './base';
import { TokenEntity, TokenModel } from './Token';

class PieSmartPoolHistoryEntity extends HistoryEntityBase {
  @prop({ required: true })
  underlyingTokenAddresses: string[];
  @prop({ required: true })
  controllerAddress: string;
  @prop({ required: true })
  publicSwapSetterAddress: string;
  @prop({ required: true })
  tokenBinderAddress: string;
  @prop({ required: true })
  circuitBreakerAddress: string;
  @prop({ required: true })
  publicSwapEnabled: boolean;
  @prop({ type: BigNumberType, required: true })
  cap: BigNumber;
  @prop({ type: BigNumberType, required: true })
  annualFee: BigNumber;
  @prop({ required: true })
  feeRecipientAddress: string;
  @prop({ required: true })
  balancerPoolAddressAddress: string;
  @prop({ type: BigNumberType, required: true })
  swapFee: BigNumber;
  @prop({ type: BigNumberType })
  startBlock?: BigNumber;
  @prop({ type: BigNumberType })
  endBlock?: BigNumber;
  @prop({ required: true })
  joinExitEnabled: boolean;
  @prop({ type: BigNumberType })
  denormalizedWeights?: Map<string, BigNumber>;
  @prop({ type: BigNumberType })
  targetWeights?: Map<string, BigNumber>;
  @prop({ type: BigNumberType })
  startWeights?: Map<string, BigNumber>;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
class PieSmartPoolEntity extends TokenEntity {
  @prop({
    ref: () => PieSmartPoolHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
  })
  history?: Ref<PieSmartPoolHistoryEntity>[];
}

export const PieSmartPoolModel = getDiscriminatorModelForClass(
  TokenModel,
  PieSmartPoolEntity,
);

export const PieSmartPoolHistoryModel = getModelForClass(
  PieSmartPoolHistoryEntity,
);
