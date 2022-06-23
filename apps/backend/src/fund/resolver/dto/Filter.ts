import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

enum Order {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(Order, {
  name: 'Order',
});

enum MarketDataFilterField {
  timestamp = 'timestamp',
}

registerEnumType(MarketDataFilterField, {
  name: 'MarketDataFilterField',
});

@InputType()
export class MarketDataOrderBy {
  @Field(() => MarketDataFilterField)
  field: MarketDataFilterField;
  @Field(() => Order)
  value: Order;
}

enum TokenFilterField {
  timestamp = 'timestamp',
}

registerEnumType(TokenFilterField, {
  name: 'TokenFilterField',
});

@InputType()
export class TokenOrderBy {
  @Field(() => MarketDataFilterField)
  field: MarketDataFilterField;
  @Field(() => Order)
  value: Order;
}

@InputType()
export class MarketDataFilter {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  limit?: number;
  @Field(() => [MarketDataOrderBy], {
    nullable: true,
    defaultValue: () => [
      {
        field: MarketDataFilterField.timestamp,
        value: Order.desc,
      },
    ],
  })
  orderBy?: Array<MarketDataOrderBy>;
}

@InputType()
export class TokenFilter {
  @Field(() => Int, { nullable: true, defaultValue: 100 })
  limit?: number;
  @Field(() => [TokenFilterField], { nullable: true, defaultValue: () => [] })
  orderBy?: Array<TokenFilterField>;
}
