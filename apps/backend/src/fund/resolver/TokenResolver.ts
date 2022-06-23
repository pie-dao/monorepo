import { Args, Query, Resolver } from '@nestjs/graphql';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { TokenFiltersInput } from './dto';
import { TokenEntity } from './entity';

@Resolver(() => TokenEntity)
export class TokenResolver {
  constructor(private readonly tokenRepository: MongoTokenRepository) {}

  @Query(() => [TokenEntity], {
    name: 'tokens',
    description: 'Returns all tokens',
  })
  async findAll(@Args('filters') tokenFilters: TokenFiltersInput) {
    return [];
  }
}
