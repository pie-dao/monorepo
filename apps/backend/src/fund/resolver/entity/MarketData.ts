import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PriceChange {
  @Field(() => Float, {
    nullable: true,
  })
  price: number | null;
  @Field(() => Float, {
    nullable: true,
  })
  change: number | null;
}

@ObjectType()
export class Interests {
  @Field(() => Float)
  apr: number;
  @Field(() => Float)
  apy: number;
}

@ObjectType({
  description:
    'Contains market information for a given token at a specific timestamp.',
})
export class MarketDataEntity {
  @Field(() => Float)
  currentPrice: number;

  @Field(() => PriceChange)
  twentyFourHourChange: PriceChange;

  @Field(() => Float, {
    description:
      'The performance (%) from the creation of the pie until today. All pies start at $1, so the performance is the nav.',
  })
  fromInception: number;

  @Field(() => Float, {
    description:
      'The premium or the discount between price and nav. Positive is premium, negative is discount.',
  })
  deltaToNav: number;

  @Field(() => Float, {
    description: 'The all time high price of the token.',
  })
  allTimeHigh: number;

  @Field(() => Float, {
    description: 'The all time low price of the token.',
  })
  allTimeLow: number;

  @Field(() => Interests)
  interests: Interests;

  @Field(() => Float, {
    description:
      'Nav is the difference between the price of the token and the aggregated price of its unerlyings.',
  })
  nav: number;

  @Field(() => Float, {
    description: 'Total supply * nav.',
  })
  marketCap: number;

  @Field(() => Int, {
    description:
      'The number of users that are holding this token. (defaults to `0` if not available)',
  })
  numberOfHolders: number;

  @Field(() => Float, {
    nullable: true,
  })
  swapFee: number | null;

  @Field(() => Float, {
    nullable: true,
    description: 'AKA streaming fee is an annualized fee for the pie.',
  })
  managementFee: number | null;

  @Field(() => Float)
  totalSupply: number;
}
