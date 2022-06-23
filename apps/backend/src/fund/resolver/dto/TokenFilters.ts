import { Field, InputType } from '@nestjs/graphql';
import { MarketDataFilter } from './Filter';

@InputType()
export class TokenFiltersInput {
  @Field(() => MarketDataFilter, { nullable: true })
  token?: MarketDataFilter;
  @Field(() => MarketDataFilter, { nullable: true })
  marketData?: MarketDataFilter;
}
