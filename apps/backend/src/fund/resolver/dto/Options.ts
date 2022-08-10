import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

enum Order {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(Order, {
  name: 'Order',
});

@InputType()
export class OrderBy {
  @Field(() => String)
  field: string;
  @Field(() => Order)
  value: Order;
}

@InputType()
export class Option {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => [OrderBy], { nullable: true })
  orderBy?: Array<OrderBy>;
}

@InputType()
export class Options {
  @Field(() => Option, { nullable: true, defaultValue: {} })
  entity?: Option;
  @Field(() => Option, { nullable: true, defaultValue: {} })
  marketData?: Option;
}
