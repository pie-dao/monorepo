import { Strategy, YieldData } from '@domain/feature-funds';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { ContractEntity } from '../base/ContractEntity';
import { DiscriminatedTokenEntity } from '../Token';

const discriminatorKey = 'kind';
const collection = 'yieldvaultstrategy';

export class ApyEntity {
  @prop({ required: true })
  compoundingFrequency: number;
  @prop({ required: true })
  value: number;
}

export class YieldDataEntity implements YieldData {
  @prop({ required: true })
  apr: number;
  @prop({ required: true, _id: false })
  apy: ApyEntity;
  @prop({ required: true })
  timestamp: Date;
}

@modelOptions({
  schemaOptions: { collection },
})
export class YieldVaultStrategyEntity
  extends ContractEntity
  implements Strategy
{
  @prop({ type: YieldDataEntity, default: [], _id: false })
  yields: Types.Array<YieldDataEntity>;

  @prop({ required: true, default: [], type: String })
  vaults: string[];

  @prop({ _id: false })
  underlyingToken: DiscriminatedTokenEntity;

  @prop({ required: true })
  trusted: boolean;
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
