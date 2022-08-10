import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_ENTITY_OPTIONS,
  TokenFilters,
} from '@domain/feature-funds';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { Options } from './dto';
import { TokenEntity } from './entity';

@Resolver(() => TokenEntity)
export class TokenResolver {
  constructor(private readonly tokenRepository: MongoTokenRepository) {}

  @Query(() => [TokenEntity], {
    name: 'tokens',
    description: 'Returns all tokens regardless of their kind.',
  })
  async findAll(
    @Args('filters', { nullable: true }) tokenFilters?: Options,
  ): Promise<TokenEntity[]> {
    // 👇 This mapping is horrendous, but necessary. If you know a better solution pls share it.
    const filters: TokenFilters = {
      entity: DEFAULT_ENTITY_OPTIONS,
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
    if (tokenFilters?.entity) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      tokenFilters?.entity?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.entity = {
        limit: tokenFilters.entity?.limit ?? undefined,
        orderBy,
      };
    }
    return Promise.resolve([]);
    // return pipe(
    //   this.tokenRepository.find(filters),
    //   T.map((tokens) =>
    //     tokens.map((token) => ({
    //       ...token,
    //     })),
    //   ),
    // )();
  }
}
