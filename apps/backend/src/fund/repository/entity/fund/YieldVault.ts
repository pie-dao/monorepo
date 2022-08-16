import { YieldVaultHistory } from '@domain/feature-funds';
import {
  getDiscriminatorModelForClass,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { Model, Types } from 'mongoose';
import { BigNumberType } from '../..';
import { HistoryEntityBase } from '../base';
import { YieldVaultStrategyEntity } from '../strategy';
import { DiscriminatedTokenEntity, DiscriminatedTokenModel } from '../Token';

@modelOptions({
  schemaOptions: {
    collection: 'yieldvaulthistory',
  },
})
export class YieldVaultHistoryEntity
  extends HistoryEntityBase
  implements YieldVaultHistory
{
  @prop({ required: true })
  underlyingToken: DiscriminatedTokenEntity;

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

  @prop({ type: YieldVaultStrategyEntity, default: [], _id: false })
  withdrawalQueue?: Types.Array<YieldVaultStrategyEntity>;
}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class YieldVaultEntity extends DiscriminatedTokenEntity {
  @prop({
    ref: () => YieldVaultHistoryEntity,
    foreignField: 'fundId',
    localField: '_id',
    default: [],
  })
  history: YieldVaultHistoryEntity[];

  @prop({
    type: String,
    default: [],
  })
  strategies: Types.Array<string>;
}

export const YieldVaultModel = getDiscriminatorModelForClass(
  DiscriminatedTokenModel,
  YieldVaultEntity,
  'YieldVault',
) as unknown as Model<YieldVaultEntity>;

export const YieldVaultHistoryModel = getModelForClass(
  YieldVaultHistoryEntity,
) as unknown as Model<YieldVaultHistory>;
