import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { discriminatorKey: 'kind', collection: 'tokens' },
})
export class TokenEntity {
  @prop({ required: true })
  address: string;
  @prop({ required: true })
  name: string;
  @prop({ required: true })
  symbol: string;
  @prop({ required: true })
  decimals: number;
}

export const TokenModel = getModelForClass(TokenEntity);
