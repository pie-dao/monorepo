import { Token } from '@domain/feature-funds';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { discriminatorKey: 'kind', collection: 'tokens' },
})
export class TokenEntity implements Token {
  @prop({ required: true, index: true })
  address: string;
  @prop({ required: true, index: true })
  name: string;
  @prop({ required: true, index: true })
  symbol: string;
  @prop({ required: true })
  decimals: number;
  @prop({ required: true, index: true })
  public kind: string;
}

export const TokenModel = getModelForClass(TokenEntity);
