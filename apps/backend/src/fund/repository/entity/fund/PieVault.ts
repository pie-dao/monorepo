import {
  PieVaultHistory,
  Token,
  TokenDetails as TokenDetailsType,
} from '@domain/feature-funds';
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
import { ContractEntity } from '../base/ContractEntity';
import { MarketDataEntity } from '../MarketData';
import { DiscriminatedTokenEntity, DiscriminatedTokenModel } from '../Token';

export class UnderlyingTokenEntity extends ContractEntity implements Token {
  @prop({ required: true, index: true })
  name: string;

  @prop({ required: true, index: true })
  symbol: string;

  @prop({ required: true })
  decimals: number;

  @prop({ required: false, index: true })
  public coinGeckoId: string;

  @prop()
  marketData: MarketDataEntity[];
}

export class TokenDetails implements TokenDetailsType {
  @prop()
  token: UnderlyingTokenEntity;
  @prop({ type: BigNumberType, required: true })
  balance: BigNumber;
}

@modelOptions({
  schemaOptions: { collection: 'pievaulthistory' },
})
export class PieVaultHistoryEntity
  extends HistoryEntityBase
  implements PieVaultHistory
{
  @prop({ type: BigNumberType })
  entryFee?: BigNumber;

  @prop({ type: BigNumberType })
  exitFee?: BigNumber;

  @prop({ type: BigNumberType })
  annualizedFee?: BigNumber;

  @prop()
  feeBeneficiary?: string;

  @prop({ type: BigNumberType })
  feeBeneficiaryEntryShare?: BigNumber;

  @prop({ type: BigNumberType })
  feeBeneficiaryExitShare?: BigNumber;

  @prop({ type: BigNumberType })
  outstandingAnnualizedFee?: BigNumber;

  @prop()
  locked?: boolean;

  @prop({ type: BigNumberType })
  lockedUntil?: BigNumber;

  @prop({ type: BigNumberType })
  cap?: BigNumber;

  @prop({ type: TokenDetails, default: [] })
  underlyingTokens: Types.Array<TokenDetails>;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class PieVaultEntity extends DiscriminatedTokenEntity {
  @prop({
    ref: () => PieVaultHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
    default: [],
  })
  history: PieVaultHistoryEntity[];
}

export const PieVaultModel = getDiscriminatorModelForClass(
  DiscriminatedTokenModel,
  PieVaultEntity,
  'PieVault',
);

export const PieVaultHistoryModel = getModelForClass(PieVaultHistoryEntity);
