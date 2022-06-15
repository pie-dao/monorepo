import { Strategy, YieldVaultHistory } from '@domain/feature-funds';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { Types } from 'mongoose';
import { BigNumberType } from '../repository';
import { HistoryEntityBase } from './base';
import { TokenEntity, TokenModel } from './Token';

export class StrategyEntity implements Strategy {
  @prop({ required: true })
  name: string;

  @prop({ _id: false })
  underlyingToken: TokenEntity;

  @prop({ type: BigNumberType, required: true })
  depositedAmount: BigNumber;

  @prop({ type: BigNumberType, required: true })
  estimatedAmount: BigNumber;

  @prop({ required: true })
  manager: string;

  @prop({ required: true })
  strategist: string;

  @prop({ required: true })
  trusted: boolean;

  @prop({ type: BigNumberType, required: true })
  balance: BigNumber;
}

@modelOptions({
  schemaOptions: { collection: 'yieldvaulthistory' },
})
export class YieldVaultHistoryEntity
  extends HistoryEntityBase
  implements YieldVaultHistory
{
  @prop({ required: true })
  underlyingToken: TokenEntity;

  @prop({ type: BigNumberType })
  harvestFeePercent?: BigNumber;

  @prop()
  harvestFeeReceiver?: string;

  @prop({ type: BigNumberType })
  burningFeePercent?: BigNumber;

  @prop()
  burningFeeReceiver?: string;

  @prop({ type: BigNumberType })
  harvestWindow?: BigNumber;

  @prop({ type: BigNumberType })
  harvestDelay?: BigNumber;

  @prop({ type: BigNumberType })
  nextHarvestDelay?: BigNumber;

  @prop({ type: BigNumberType, required: true })
  totalStrategyHoldings: BigNumber;

  @prop({ type: BigNumberType })
  lastHarvestExchangeRate?: BigNumber;

  @prop({ type: BigNumberType })
  lastHarvestIntervalInBlocks?: BigNumber;

  @prop({ type: BigNumberType })
  lastHarvestWindowStartBlock?: BigNumber;

  @prop()
  lastHarvestWindowStart?: Date;

  @prop()
  lastHarvest?: Date;

  @prop({ type: BigNumberType })
  maxLockedProfit?: BigNumber;

  @prop({ type: BigNumberType })
  batchBurnRound?: BigNumber;

  @prop({ type: BigNumberType })
  batchBurnBalance?: BigNumber;

  @prop({ type: BigNumberType })
  userDepositLimit: BigNumber;

  @prop({ type: BigNumberType })
  vaultDepositLimit: BigNumber;

  @prop({ type: BigNumberType })
  estimatedReturn: BigNumber;

  @prop({ type: BigNumberType })
  exchangeRate: BigNumber;

  @prop({ type: BigNumberType, required: true })
  totalFloat: BigNumber;

  @prop({ type: BigNumberType, required: true })
  lockedProfit: BigNumber;

  @prop({ type: BigNumberType, required: true })
  totalUnderlying: BigNumber;

  @prop({ type: StrategyEntity, default: [], _id: false })
  withdrawalQueue?: Types.Array<StrategyEntity>;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class YieldVaultEntity extends TokenEntity {
  @prop({
    ref: () => YieldVaultHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
    default: [],
  })
  history: YieldVaultHistoryEntity[];
}

export const YieldVaultModel = getDiscriminatorModelForClass(
  TokenModel,
  YieldVaultEntity,
  'YieldVault',
);

export const YieldVaultHistoryModel = getModelForClass(YieldVaultHistoryEntity);
