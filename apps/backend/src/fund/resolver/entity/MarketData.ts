import { MarketData } from '@domain/feature-funds';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CurrencyDataEntity } from './CurrencyData';

@ObjectType({
  description:
    'Contains market information for a given token at a specific timestamp.',
})
export class MarketDataEntity implements MarketData {
  @Field(() => [CurrencyDataEntity], {
    description:
      'Price metadata at the given timestamp in all the supported currencies.',
  })
  currencyData: Array<CurrencyDataEntity>;
  @Field(() => Int, {
    description: 'The rank of the token at the given timestamp.',
  })
  marketCapRank: number;
  @Field(() => Int, {
    description:
      'The currently circulating supply of the token at the given timestamp.',
  })
  circulatingSupply: number;
  @Field({ description: 'The timestamp at which this data was taken.' })
  timestamp: Date;
}
