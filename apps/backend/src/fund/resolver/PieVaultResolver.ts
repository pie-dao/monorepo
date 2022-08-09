import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_ENTITY_FILTER,
  TokenFilters,
} from '@domain/feature-funds';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import { MongoPieVaultRepository } from '../repository';
import { TokenFiltersInput } from './dto';
import { PieVaultEntity } from './entity';

@Resolver(() => PieVaultEntity)
export class PieVaultResolver {
  constructor(private readonly repository: MongoPieVaultRepository) {}

  @Query(() => [PieVaultEntity], {
    name: 'vaults',
    description: 'Returns all pie vaults.',
  })
  async findAll(
    @Args('currency', { nullable: false })
    currency: string,
    @Args('filters', { nullable: true })
    tokenFilters?: TokenFiltersInput,
  ): Promise<PieVaultEntity[]> {
    const filters: TokenFilters = {
      entity: DEFAULT_ENTITY_FILTER,
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
      filters.entity = {
        limit: tokenFilters.token?.limit ?? undefined,
        orderBy,
      };
    }
    return pipe(
      this.repository.find(filters),
      T.map((vaults) => {
        return vaults.map((vault) => {
          return {
            chain: vault.chain,
            address: vault.address,
            name: vault.name,
            symbol: vault.symbol,
            decimals: vault.decimals,
            currency: currency,
            riskGrade: 'AAA',
            inceptionDate: '',
            kind: 'PieVault',
            marketData: vault.marketData.map((marketData) => {
              const currencyData = marketData.currencyData.find(
                (entry) => entry.currency === currency,
              );
              return {
                currentPrice: currencyData?.price ?? 0,
                twentyFourHourChange: {
                  price: currencyData?.priceChange24h,
                  change: currencyData?.priceChangePercentage24h,
                },
                fromInception: 0,
                deltaToNav: 0,
                interests: {
                  apr: 0,
                  apy: 0,
                },
                nav: 0,
                marketCap: currencyData?.marketCap ?? 0,
                numberOfHolders: 0,
                allTimeHigh: currencyData?.ath,
                allTimeLow: currencyData?.atl,
                swapFee: null,
                managementFee: null,
                totalSupply: marketData.circulatingSupply,
              };
            }),
            governance: [],
            underlyingTokens: [],
          };
        });
      }),
    )();
  }
}
