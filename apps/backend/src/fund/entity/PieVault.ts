import {
  PieVaultHistory,
  TokenDetails as TokenDetailsType,
} from '@domain/feature-funds';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { Types } from 'mongoose';
import { HistoryEntityBase, TokenEntity, TokenModel } from '.';
import { BigNumberType } from '..';

export class TokenDetails implements TokenDetailsType {
  @prop()
  token: TokenEntity;
  @prop({ type: BigNumberType, required: true })
  balance: BigNumber;
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
})
export class PieVaultHistoryEntity
  extends HistoryEntityBase
  implements PieVaultHistory
{
  @prop({ type: BigNumberType, required: true })
  entryFee: BigNumber;
  @prop({ type: BigNumberType, required: true })
  exitFee: BigNumber;
  @prop({ type: BigNumberType, required: true })
  annualizedFee: BigNumber;
  @prop({ required: true })
  feeBeneficiary: string;
  @prop({ type: BigNumberType, required: true })
  feeBeneficiaryEntryShare: BigNumber;
  @prop({ type: BigNumberType, required: true })
  feeBeneficiaryExitShare: BigNumber;
  @prop({ type: BigNumberType, required: true })
  outstandingAnnualizedFee: BigNumber;
  @prop({ required: true })
  locked: boolean;
  @prop({ type: BigNumberType })
  lockedUntil?: BigNumber;
  @prop({ type: BigNumberType, required: true })
  cap: BigNumber;
  @prop({ type: TokenDetails, default: [] })
  underlyingTokens: Types.Array<TokenDetails>;
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
  history?: PieVaultHistoryEntity[];
}

export const PieVaultModel = getDiscriminatorModelForClass(
  TokenModel,
  PieVaultEntity,
);

export const PieVaultHistoryModel = getModelForClass(PieVaultHistoryEntity);