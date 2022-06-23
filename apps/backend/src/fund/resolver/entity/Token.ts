import { SupportedChain, Token } from '@domain/feature-funds';
import { Field, ObjectType } from '@nestjs/graphql';
import { MarketDataEntity } from './MarketData';

@ObjectType()
export class TokenEntity implements Token {
  @Field(() => String, { description: 'The chain on which this token lives.' })
  chain: SupportedChain;
  @Field()
  address: string;
  @Field()
  name: string;
  @Field()
  symbol: string;
  @Field()
  decimals: number;
  @Field({
    description: "The kind of this token (eg: 'PieVault', 'YieldVault', etc).",
  })
  public kind: string;
  @Field()
  public coinGeckoId: string;
  @Field(() => [MarketDataEntity], {
    description: 'Market data for this token.',
  })
  marketData: MarketDataEntity[];
}
