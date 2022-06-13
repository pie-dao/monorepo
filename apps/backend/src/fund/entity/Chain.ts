import { Chain } from '@domain/feature-funds';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'chains' },
})
export class ChainEntity implements Chain {
  @prop({ required: true, index: true })
  chainId: number;
  @prop({ required: true, index: true })
  name: string;
}

export const ChainModel = getModelForClass(ChainEntity);
