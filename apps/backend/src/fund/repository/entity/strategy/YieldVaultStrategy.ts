import { YieldVaultStrategy } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-types';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import BigNumber from 'bignumber.js';
import { BigNumberType } from '../..';
import { DiscriminatedTokenEntity } from '../Token';

const discriminatorKey = 'kind';
const collection = 'yieldvaultstrategy';

@modelOptions({
  schemaOptions: { collection },
})
export class YieldVaultStrategyEntity implements YieldVaultStrategy {
  @prop({ type: String, required: true, index: true })
  chain: SupportedChain;
  @prop({ required: true })
  address: string;
  @prop({ required: true })
  kind: string;
  @prop({ required: true })
  name: string;

  @prop({ _id: false })
  underlyingToken: DiscriminatedTokenEntity;

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
  schemaOptions: { discriminatorKey, collection },
})
export class DiscriminatedYieldVaultStrategyEntity extends YieldVaultStrategyEntity {}

export const YieldVaultStrategyModel = getModelForClass(
  YieldVaultStrategyEntity,
);

export const DiscriminatedYieldVaultStrategyModel = getModelForClass(
  DiscriminatedYieldVaultStrategyEntity,
);
