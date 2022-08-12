import { Field, ObjectType } from '@nestjs/graphql';
import { SupportedChain } from '@shared/util-types';
import { UnerlyingMarketData } from './UnderlyingMarketData';

@ObjectType()
export class UnderlyingTokenEntity {
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

  @Field(() => [UnerlyingMarketData], {
    description: 'Market data for this underlying token.',
  })
  marketData: UnerlyingMarketData[];
}
