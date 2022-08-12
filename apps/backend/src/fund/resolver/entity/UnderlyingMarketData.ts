import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Contains market information for an underlying token.',
})
export class UnerlyingMarketData {
  /**
   * The amount of the underlying token that needs to be present for the minting of a pie.
   */
  @Field(() => Float, { nullable: true })
  amountPerToken?: number;
  /**
   * The amount of underlying token held by the pie.
   */
  @Field(() => Float)
  totalHeld: number;
  /**
   * The percentage of the underlying token held by the pie.
   */
  @Field(() => Float)
  allocation: number;

  @Field(() => Float)
  currentPrice: number;

  @Field(() => Float, {
    description:
      'Nav is the difference between the price of the token and the aggregated price of its unerlyings.',
  })
  nav: number;

  @Field(() => Float, {
    description: 'Total supply * nav.',
  })
  marketCap: number;

  @Field(() => Float)
  totalSupply: number;
}
