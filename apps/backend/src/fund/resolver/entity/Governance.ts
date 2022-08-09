import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GovernanceEntity {
  @Field(() => String)
  title: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  status: string;
  @Field(() => String)
  timestamp: string;
}
