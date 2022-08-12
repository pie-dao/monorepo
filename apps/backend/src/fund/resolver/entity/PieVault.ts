import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SupportedChain } from '@shared/util-types';
import { GovernanceEntity } from './Governance';
import { MarketDataEntity } from './MarketData';
import { TokenEntity } from './Token';
import { UnderlyingTokenEntity } from './UnderlyingToken';

@ObjectType()
export class PieVaultEntity {
  @Field(() => String, { description: 'The chain on which this token lives.' })
  chain: SupportedChain;

  @Field()
  address: string;

  @Field()
  name: string;

  @Field()
  symbol: string;

  @Field(() => Int)
  decimals: number;

  @Field()
  currency: string;

  @Field()
  riskGrade: string;

  @Field()
  inceptionDate: string;

  @Field({
    description: "The kind of this token (eg: 'PieVault', 'YieldVault', etc).",
  })
  public kind: string;

  @Field(() => [MarketDataEntity], {
    description: 'Market data for this token.',
  })
  marketData: MarketDataEntity[];

  @Field(() => [GovernanceEntity])
  governance: GovernanceEntity[];

  @Field(() => [UnderlyingTokenEntity])
  underlyingTokens: UnderlyingTokenEntity[];
}
