import { Token } from '@domain/feature-funds';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { ContractEntity } from './base/ContractEntity';
import { MarketDataEntity } from './MarketData';

@modelOptions({
  schemaOptions: { collection: 'tokens' },
})
export class TokenEntity extends ContractEntity implements Token {
  @prop({ required: true, index: true })
  name: string;

  @prop({ required: true, index: true })
  symbol: string;

  @prop({ required: true })
  decimals: number;

  @prop({ required: false, index: true })
  public coinGeckoId: string;

  @prop({
    ref: () => MarketDataEntity,
    foreignField: 'tokenId',
    localField: '_id',
    default: [],
  })
  marketData: MarketDataEntity[];
}

@modelOptions({
  schemaOptions: { discriminatorKey: 'kind', collection: 'tokens' },
})
export class DiscriminatedTokenEntity extends TokenEntity {}

export const TokenModel = getModelForClass(TokenEntity);

export const DiscriminatedTokenModel = getModelForClass(
  DiscriminatedTokenEntity,
);
