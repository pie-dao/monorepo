import { CurrencyData } from '@domain/feature-funds';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { SupportedCurrency } from '@shared/util-types';

@ObjectType({
  description: 'Represents market data denominated in a specific currency.',
})
export class CurrencyDataEntity implements CurrencyData {
  @Field(() => String, { description: 'The name of the currency (eg: ETH)' })
  currency: SupportedCurrency;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  marketCap: number;

  @Field(() => Float)
  volume: number;

  @Field(() => Float)
  nav: number;

  @Field(() => Float, { nullable: true })
  priceChange24h?: number;

  @Field(() => Float, { nullable: true })
  priceChangePercentage24h?: number;

  @Field(() => Float, { nullable: true })
  ath?: number;

  @Field(() => Float, { nullable: true })
  atl?: number;
}
