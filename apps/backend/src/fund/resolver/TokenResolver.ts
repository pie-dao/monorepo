import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_TOKEN_FILTER,
  TokenFilters,
} from '@domain/feature-funds';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { TokenFiltersInput } from './dto';
import { TokenEntity } from './entity';

@Resolver(() => TokenEntity)
export class TokenResolver {
  constructor(private readonly tokenRepository: MongoTokenRepository) {}

  @Query(() => [TokenEntity], {
    name: 'tokens',
    description: 'Returns all tokens regardless of their kind.',
  })
  async findAll(
    @Args('filters', { nullable: true }) tokenFilters?: TokenFiltersInput,
  ): Promise<TokenEntity[]> {
    // 👇 This mapping is horrendous, but necessary. If you know a better solution pls share it.
    const filters: TokenFilters = {
      token: DEFAULT_TOKEN_FILTER,
      marketData: DEFAULT_CHILD_FILTER,
    };
    if (tokenFilters?.marketData) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      tokenFilters?.marketData?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.marketData = {
        limit: tokenFilters.marketData?.limit ?? undefined,
        orderBy,
      };
    }
    if (tokenFilters?.token) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      tokenFilters?.token?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.token = {
        limit: tokenFilters.token?.limit ?? undefined,
        orderBy,
      };
    }
    return pipe(
      this.tokenRepository.find(filters),
      T.map((tokens) =>
        tokens.map((token) => ({
          ...token,
        })),
      ),
    )();
  }
}
