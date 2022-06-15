import { Token } from '@domain/feature-funds';
import { SupportedChain } from '@shared/util-chain';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { TokenMarketDataEntity } from './TokenMarketData';

@modelOptions({
  schemaOptions: { discriminatorKey: 'kind', collection: 'tokens' },
})
export class TokenEntity implements Token {
  @prop({ type: String, required: true, index: true })
  chain: SupportedChain;
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
  @prop({ required: false, index: true })
  public coinGeckoId: string;
  @prop({
    ref: () => TokenMarketDataEntity,
    foreignField: 'tokenId',
    localField: '_id',
    default: [],
  })
  tokenMarketData: TokenMarketDataEntity[];
}

export const TokenModel = getModelForClass(TokenEntity);
