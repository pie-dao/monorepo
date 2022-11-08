import { CurrencyData, PieVault, TokenFilters } from '@domain/feature-funds';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_ENTITY_OPTIONS,
  SupportedChain,
} from '@shared/util-types';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { FUND_LOADING_INTERVAL, ONE_DAY } from '../loaders/constants';
import { MongoPieVaultRepository } from '../repository';
import { Options } from './dto';
import { MarketDataEntity, PieVaultEntity } from './entity';
import { UnderlyingTokenEntity } from './entity/UnderlyingToken';

@Resolver(() => PieVaultEntity)
export class PieVaultResolver {
  constructor(private readonly repository: MongoPieVaultRepository) {}

  @Query(() => [PieVaultEntity], {
    name: 'pieVaults',
    description: 'Returns all pie vaults.',
  })
  async findAll(
    @Args('currency', { nullable: false })
    currency: string,
    @Args('options', { nullable: true })
    options?: Options,
  ): Promise<PieVaultEntity[]> {
    const filters: TokenFilters = {
      entity: DEFAULT_ENTITY_OPTIONS,
      marketData: DEFAULT_CHILD_FILTER,
    };
    if (options?.marketData) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      options?.marketData?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.marketData = {
        limit: options.marketData?.limit ?? undefined,
        orderBy,
      };
    }
    if (options?.entity) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      options?.entity?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.entity = {
        limit: options.entity?.limit ?? undefined,
        orderBy,
      };
    }
    return pipe(
      this.repository.find(filters),
      T.map((vaults) => {
        return vaults.map((vault) => {
          return this.mapVault(vault, currency);
        });
      }),
    )();
  }

  @Query(() => PieVaultEntity, {
    name: 'pieVault',
    description: 'Returns a pie vault by its address.',
  })
  async findOne(
    @Args('currency', { nullable: false })
    currency: string,
    @Args('chain', { nullable: false })
    chain: string,
    @Args('address', { nullable: false })
    address: string,
  ): Promise<PieVaultEntity> {
    const result = await pipe(
      this.repository.findOne(
        {
          chain: chain as SupportedChain,
          address,
        },
        {
          marketData: {
            limit: ONE_DAY / FUND_LOADING_INTERVAL,
            orderBy: {
              timestamp: 'desc',
            },
          },
        },
      ),
      TE.map((vault) => {
        return this.mapVault(vault, currency);
      }),
    )();

    if (E.isRight(result)) {
      return result.right;
    } else {
      throw result.left;
    }
  }

  private mapVault(vault: PieVault, currency: string): PieVaultEntity {
    let marketData: MarketDataEntity[] = [];

    if (vault.marketData.length > 0) {
      const latest = vault.marketData[0];
      const oldest = vault.marketData[vault.marketData.length - 1];

      const latestPrice: CurrencyData = latest.currencyData.find(
        (entry) => entry.currency === currency,
      ) ?? {
        currency: 'usd',
        price: 0,
        marketCap: 0,
        nav: 0,
      };

      const oldestPrice: CurrencyData = oldest.currencyData.find(
        (entry) => entry.currency === currency,
      ) ?? {
        currency: 'usd',
        price: 0,
        marketCap: 0,
        nav: 0,
      };

      const spread = latestPrice.price - latestPrice.nav;
      const priceChange24h = latestPrice.price - oldestPrice.price;
      const priceChangePercentage24h =
        (latestPrice.price / oldestPrice.price - 1) * 100;

      marketData = [
        {
          currentPrice: latestPrice.price,
          twentyFourHourChange: {
            price: priceChange24h,
            change: priceChangePercentage24h,
          },
          fromInception: (latestPrice.nav - 1) * 100,
          deltaToNav: (spread / latestPrice.price) * 100,
          nav: latestPrice.nav,
          marketCap: latestPrice.marketCap,
          totalSupply: latest.circulatingSupply,
          allTimeHigh: latestPrice.ath,
          allTimeLow: latestPrice.atl,
          // TODO: implement these 👇
          numberOfHolders: 0,
          swapFee: null,
          managementFee: null,
          interests: {
            apr: 0,
            apy: 0,
          },
        },
      ];
    }

    let underlyingTokens: UnderlyingTokenEntity[] = [];
    if (vault.latest?.underlyingTokens) {
      const uts = vault.latest.underlyingTokens;

      console.log(`uts: ${JSON.stringify(uts)}`);

      const allocations = new Map(
        uts.map(({ token, balance }) => {
          const price =
            token.marketData[0].currencyData.find(
              (it) => it.currency === currency,
            )?.price ?? 0;
          return [token.address, balance.toNumber() * price];
        }),
      );

      const totalAllocations = Array.from(allocations.values()).reduce(
        (acc, allocation) => {
          return acc + allocation;
        },
        0,
      );

      underlyingTokens = uts.map(({ token, balance }) => {
        const price =
          token.marketData[0].currencyData.find(
            (it) => it.currency === currency,
          )?.price ?? 0;
        return {
          chain: token.chain,
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          kind: token.kind,
          marketData: token.marketData.map((md) => ({
            totalHeld: balance.toNumber(),
            allocation: allocations.get(token.address) / totalAllocations,
            currentPrice: price,
            nav: price,
            totalSupply: md.circulatingSupply,
            marketCap: md.circulatingSupply * price,
          })),
        };
      });
    }

    return {
      chain: vault.chain,
      address: vault.address,
      name: vault.name,
      symbol: vault.symbol,
      decimals: vault.decimals,
      currency: currency,
      riskGrade: 'AAA',
      // TODO: get this from somewhere 👇
      inceptionDate: '',
      kind: 'PieVault',
      marketData: marketData,
      underlyingTokens: underlyingTokens,
      // TODO: load this from Snapshot 👇
      governance: [],
    };
  }
}
