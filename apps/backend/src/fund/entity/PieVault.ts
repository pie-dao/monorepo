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

export class PieVaultHistoryEntity extends HistoryEntityBase {
  @prop({ type: BigNumberType, required: true })
  entryFee: BigNumber;
  @prop({ type: BigNumberType, required: true })
  exitFee: BigNumber;
  @prop({ type: BigNumberType, required: true })
  annualizedFee: BigNumber;
  @prop({ required: true })
  feeBeneficiaryAddress: string;
  @prop({ type: BigNumberType, required: true })
  feeBeneficiaryEntryShare: BigNumber;
  @prop({ type: BigNumberType, required: true })
  feeBeneficiaryExitShare: BigNumber;
  @prop({ type: BigNumberType, required: true })
  outstandingAnnualizedFeet: BigNumber;
  @prop({ required: true })
  locked: boolean;
  @prop({ type: BigNumberType })
  lockedUntil?: BigNumber;
  @prop({ type: BigNumberType, required: true })
  cap: BigNumber;
  @prop({ type: BigNumberType })
  underlyingTokens: Map<string, BigNumber>;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class PieVaultEntity extends TokenEntity {
  @prop({
    ref: () => PieVaultHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
  })
  history?: Ref<PieVaultHistoryEntity>[];
}

export const PieVaultModel = getDiscriminatorModelForClass(
  TokenModel,
  PieVaultEntity,
);

export const PieVaultHistoryModel = getModelForClass(PieVaultHistoryEntity);
