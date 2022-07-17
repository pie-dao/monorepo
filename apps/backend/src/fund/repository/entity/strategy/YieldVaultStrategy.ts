import { Strategy } from '@domain/feature-funds';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { ContractEntity } from '../base/ContractEntity';
import { DiscriminatedTokenEntity } from '../Token';

const discriminatorKey = 'kind';
const collection = 'yieldvaultstrategy';

@modelOptions({
  schemaOptions: { collection },
})
export class YieldVaultStrategyEntity
  extends ContractEntity
  implements Strategy
{
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
