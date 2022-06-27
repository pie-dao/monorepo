import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

enum Order {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(Order, {
  name: 'Order',
});

enum MarketDataOrderByField {
  timestamp = 'timestamp',
}

registerEnumType(MarketDataOrderByField, {
  name: 'MarketDataOrderByField',
});

@InputType()
export class MarketDataOrderBy {
  @Field(() => MarketDataOrderByField)
  field: MarketDataOrderByField;
  @Field(() => Order)
  value: Order;
}

enum TokenOrderByField {
  name = 'name',
  symbol = 'symbol',
}

registerEnumType(TokenOrderByField, {
  name: 'TokenOrderByField',
});

@InputType()
export class TokenOrderBy {
  @Field(() => TokenOrderByField)
  field: TokenOrderByField;
  @Field(() => Order)
  value: Order;
}

@InputType()
export class MarketDataFilter {
  @Field(() => Int, { nullable: true })
  limit?: number;
  @Field(() => [MarketDataOrderBy], {
    nullable: true,
  })
  orderBy?: Array<MarketDataOrderBy>;
}

@InputType()
export class TokenFilter {
  @Field(() => Int, { nullable: true })
  limit?: number;
  @Field(() => [TokenOrderBy], { nullable: true })
  orderBy?: Array<TokenOrderBy>;
}
