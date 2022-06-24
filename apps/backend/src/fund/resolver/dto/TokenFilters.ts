import { Field, InputType } from '@nestjs/graphql';
import { MarketDataFilter, TokenFilter } from './Filter';

@InputType()
export class TokenFiltersInput {
  @Field(() => TokenFilter, { nullable: true, defaultValue: {} })
  token?: TokenFilter;
  @Field(() => MarketDataFilter, { nullable: true, defaultValue: {} })
  marketData?: MarketDataFilter;
}
