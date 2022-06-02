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

class YieldVaultHistoryEntity extends HistoryEntityBase {
  @prop({ required: true })
  underlyingTokenAddress: string;
  @prop({ type: BigNumberType })
  harvestFeePercent?: BigNumber;
  @prop()
  harvestFeeReceiverAddress?: string;
  @prop({ type: BigNumberType })
  burningFeePercent?: BigNumber;
  @prop()
  burningFeeReceiverAddress?: string;
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
  userDepositLimit?: BigNumber;
  @prop({ type: BigNumberType })
  vaultDepositLimit?: BigNumber;
  @prop({ type: BigNumberType })
  estimatedReturn?: BigNumber;
  @prop({ type: BigNumberType })
  exchangeRate?: BigNumber;
  @prop({ type: BigNumberType, required: true })
  totalFloat: BigNumber;
  @prop({ type: BigNumberType, required: true })
  lockedProfit: BigNumber;
  @prop({ type: BigNumberType, required: true })
  totalUnderlying: BigNumber;
  @prop()
  withdrawalQueue?: Strategy[];
}

export class Strategy {
  @prop({ required: true })
  name: string;
  @prop({ required: true })
  underlyingTokenAddress: string;
  @prop({ type: BigNumberType, required: true })
  depositedAmount: BigNumber;
  @prop({ type: BigNumberType, required: true })
  estimatedAmount: BigNumber;
  @prop({ required: true })
  managerAddress: string;
  @prop({ required: true })
  strategistAddress: string;
  @prop({ required: true })
  trusted: boolean;
  @prop({ type: BigNumberType, required: true })
  balance: BigNumber;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
class YieldVaultEntity extends TokenEntity {
  @prop({
    ref: () => YieldVaultHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
  })
  snapshots?: Ref<YieldVaultHistoryEntity>[];
}

export const YieldVaultModel = getDiscriminatorModelForClass(
  TokenModel,
  YieldVaultEntity,
);

export const YieldVaultHistoryModel = getModelForClass(YieldVaultHistoryEntity);
