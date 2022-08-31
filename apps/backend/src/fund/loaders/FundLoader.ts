import {
  CoinGeckoAdapter,
  CoinListDto,
  DEFAULT_FUNDS,
  TokenPricesDto,
} from '@domain/data-sync';
import { CurrencyData, Token } from '@domain/feature-funds';
import { Provider } from '@ethersproject/providers';
import { DataTransferError } from '@hexworks/cobalt-http';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { check, promiseObject } from '@shared/helpers';
import {
  Erc20Abi__factory,
  PiegetterAbi,
  PiegetterAbi__factory,
} from '@shared/util-blockchain';
import {
  DatabaseError,
  EntityNotFoundError,
  SupportedChain,
  SupportedCurrency,
} from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { EthersProvider } from '../../ethers';
import { MongoPieVaultRepository } from '../repository';
import { TokenModel } from '../repository/entity';
import { MongoTokenRepository } from '../repository/MongoTokenRepository';
import { ContractExecutionError } from './error';

export class MissingDataError extends Error {
  public kind: 'MissingDataError' = 'MissingDataError';
  constructor(message: string) {
    super(message);
  }
}

export class DataDiscrepancyError extends Error {
  public kind: 'DataDiscrepancyError' = 'DataDiscrepancyError';
  constructor(message: string) {
    super(message);
  }
}

type AssetBalance = {
  address: string;
  balance: BigNumber;
};

type UnderlyingDetails = {
  chain: SupportedChain;
  address: string;
  decimals: number;
  supply: BigNumberish;
  name: string;
  symbol: string;
};

type UnderlyingAsset = AssetBalance & UnderlyingDetails;

export type PieDetails = {
  address: string;
  supply: BigNumberish;
  decimals: number;
  precision: BigNumber;
  /**
   * supply / precision
   */
  totalSupply: BigNumber;
};

@Injectable()
export class FundLoader {
  private sentry: ReturnType<SentryService['instance']>;
  private provider: Provider;
  private contract: PiegetterAbi;
  private cgCoinList: CoinListDto;

  constructor(
    private tokenRepository: MongoTokenRepository,
    private pieRepository: MongoPieVaultRepository,
    private coinGeckoAdapter: CoinGeckoAdapter,
    @InjectSentry()
    private sentryService: SentryService,
  ) {
    this.sentry = this.sentryService.instance();
    this.provider = EthersProvider.useValue;
    this.contract = PiegetterAbi__factory.connect(
      process.env.PIE_GETTER_CONTRACT,
      this.provider,
    );
  }

  @Interval(30 * 1000)
  public loadMarketData() {
    Logger.log('Loading market data...');
    return pipe(
      this.ensureFundsExist(),
      TE.chainW(
        TE.traverseArray((fund) => {
          Logger.log(`Loading market data for ${fund.name}...`);
          return pipe(
            TE.Do,
            TE.bind('fund', () => TE.of(fund)),
            TE.bind('metadata', () =>
              this.coinGeckoAdapter.getCoinMetadata(fund.coinGeckoId),
            ),
            TE.bind('nav', () => this.calculateNAV(fund)),
          );
        }),
      ),
      TE.chainW(
        TE.traverseArray(({ fund, metadata, nav }) => {
          const currencyDataLookup = new Map<SupportedCurrency, CurrencyData>();

          Object.entries(metadata.market_data.current_price).forEach(
            ([currency, amount]) => {
              currencyDataLookup.set(currency as SupportedCurrency, {
                price: amount,
                marketCap: 0,
                currency: currency as SupportedCurrency,
                nav: nav,
              });
            },
          );
          Object.entries(metadata.market_data.market_cap).forEach(
            ([currency, amount]) => {
              currencyDataLookup.get(currency as SupportedCurrency).marketCap =
                amount;
            },
          );
          Object.entries(metadata.market_data.ath).forEach(
            ([currency, amount]) => {
              currencyDataLookup.get(currency as SupportedCurrency).ath =
                amount;
            },
          );
          Object.entries(metadata.market_data.atl).forEach(
            ([currency, amount]) => {
              currencyDataLookup.get(currency as SupportedCurrency).atl =
                amount;
            },
          );
          const currencyData = Array.from(currencyDataLookup.values());
          const marketCapRank = metadata.market_data.market_cap_rank;
          const circulatingSupply = metadata.market_data.circulating_supply;
          const timestamp = new Date(Date.parse(metadata.last_updated));

          return this.tokenRepository.addMarketData(
            {
              chain: fund.chain,
              address: fund.address,
            },
            {
              marketCapRank,
              circulatingSupply,
              timestamp,
              currencyData,
            },
          );
        }),
      ),
      TE.bimap(
        (error) => {
          this.sentry.captureException(error);
          Logger.error(error);
          return error;
        },
        (result) => {
          Logger.log('CG market data loaded successfully.');
          return result;
        },
      ),
    )();
  }

  /**
   * This method makes sure that all the `DEFAULT_FUNDS` are in the database
   * using an upsert operation.
   */
  public ensureFundsExist(): TE.TaskEither<
    DatabaseError | EntityNotFoundError,
    readonly Token[]
  > {
    return pipe(
      DEFAULT_FUNDS,
      A.map((fund) => {
        return TE.tryCatch(
          () => {
            check(fund.coinGeckoId.length > 0, `coingeckoId can't be empty`);
            return TokenModel.findOneAndUpdate(
              {
                address: fund.address,
                chain: fund.chain,
              },
              {
                chain: fund.chain,
                address: fund.address,
                name: fund.name,
                symbol: fund.symbol,
                decimals: fund.decimals,
                kind: fund.kind,
                coinGeckoId: fund.coinGeckoId,
              },
              {
                upsert: true,
                new: true,
              },
            ).exec();
          },
          (err: unknown) => new DatabaseError(err),
        );
      }),
      TE.sequenceArray,
      TE.chain(
        TE.traverseArray((fund) => {
          return this.tokenRepository.findOne({
            chain: fund.chain,
            address: fund.address,
          });
        }),
      ),
    );
  }

  public getPieDetails(
    pie: Token,
  ): TE.TaskEither<ContractExecutionError, PieDetails> {
    return TE.tryCatch(
      async () => {
        const pieErc20Contract = Erc20Abi__factory.connect(
          pie.address,
          this.provider,
        );
        // TODO: load pie history here 👇
        const [supply, decimals] = await Promise.all([
          pieErc20Contract.totalSupply(),
          pieErc20Contract.decimals(),
        ]);
        const precision = new BigNumber(10).pow(decimals);
        const totalSupply = new BigNumber(supply.toString()).div(precision);

        return {
          address: pie.address,
          supply,
          decimals,
          precision,
          totalSupply,
        };
      },
      (error) => new ContractExecutionError(error),
    );
  }

  public getUnderlyingAssets(
    token: PieDetails,
  ): TE.TaskEither<ContractExecutionError, UnderlyingAsset[]> {
    return TE.tryCatch(
      async () => {
        const staticResult =
          await this.contract.callStatic.getAssetsAndAmountsForAmount(
            token.address,
            token.supply,
          );
        const underlyingAssets = staticResult[0];
        const underylingTotals = staticResult[1];

        const result: UnderlyingAsset[] = [];
        const promises: Promise<UnderlyingDetails>[] = [];

        for (const address of underlyingAssets) {
          const underlyingContract = Erc20Abi__factory.connect(
            address,
            this.provider,
          );
          promises.push(
            promiseObject({
              address: address,
              chain: SupportedChain.ETHEREUM,
              decimals: underlyingContract.decimals(),
              supply: underlyingContract.totalSupply(),
              name: underlyingContract.name(),
              symbol: underlyingContract.symbol(),
            }),
          );
        }
        const details = await Promise.all(promises);
        for (let i = 0; i < underlyingAssets.length; i++) {
          const detail = details[i];
          result.push({
            balance: new BigNumber(underylingTotals[i].toString()),
            ...detail,
          });
        }
        return result;
      },
      (error) => new ContractExecutionError(error),
    );
  }

  private calculateNAV(token: Token): TE.TaskEither<Error, number> {
    Logger.log(`Calculating NAV for ${token.name}`);
    return pipe(
      TE.Do,
      TE.bind('tokenDetails', () => this.getPieDetails(token)),
      TE.bind('underlyingAssets', ({ tokenDetails }) =>
        this.getUnderlyingAssets(tokenDetails),
      ),
      TE.bindW('prices', ({ underlyingAssets }) =>
        this.coinGeckoAdapter.getPrices(
          underlyingAssets.map((asset) => asset.address),
        ),
      ),
      TE.bindW('underlyingTokens', ({ underlyingAssets, prices }) =>
        this.ensureUnderlyingsExist(underlyingAssets, prices),
      ),
      TE.chainFirstIOK(({ underlyingTokens, underlyingAssets }) => {
        const ua = new Map(underlyingAssets.map((a) => [a.address, a]));

        console.log(`=== saving history ===`);

        return this.pieRepository.addFundHistory(
          {
            address: token.address,
            chain: token.chain,
          },
          {
            timestamp: new Date(),
            underlyingTokens: underlyingTokens.map((ut) => ({
              token: ut,
              balance: ua.get(ut.address).balance,
            })),
          },
        );
      }),
      TE.chain(({ tokenDetails, underlyingAssets, prices }) =>
        TE.tryCatch(
          async () => {
            let pieMarketCapUSD = new BigNumber(0);

            for (const asset of underlyingAssets) {
              const usdPrice = prices[asset.address.toLowerCase()].usd;
              const precision = new BigNumber(10).pow(asset.decimals);
              const allocation = asset.balance.times(usdPrice).div(precision);
              pieMarketCapUSD = pieMarketCapUSD.plus(allocation);
            }
            return (
              pieMarketCapUSD.toNumber() / tokenDetails.totalSupply.toNumber()
            );
          },
          (error) => new ContractExecutionError(error),
        ),
      ),
    );
  }

  private fetchCoinList(): TE.TaskEither<DataTransferError, CoinListDto> {
    if (this.cgCoinList) {
      return TE.of(this.cgCoinList);
    } else {
      return pipe(
        this.coinGeckoAdapter.getCoinList(),
        TE.map((list) => {
          this.cgCoinList = list;
          return list;
        }),
      );
    }
  }

  public ensureUnderlyingsExist(
    underlyingAssets: UnderlyingAsset[],
    prices: TokenPricesDto,
  ): TE.TaskEither<
    DatabaseError | DataTransferError | DataDiscrepancyError,
    readonly Token[]
  > {
    return pipe(
      TE.Do,
      TE.bind('coins', () => this.fetchCoinList()),
      TE.bindW('lookup', ({ coins }) => {
        const lookup = new Map(
          underlyingAssets.map((asset) => [asset.address.toLowerCase(), '']),
        );
        coins
          .filter((coin) =>
            lookup.has(coin.platforms['ethereum']?.toLowerCase()),
          )
          .forEach((coin) => {
            lookup.set(coin.platforms['ethereum']?.toLowerCase(), coin.id);
          });

        const missingIds = Array.from(lookup.entries())
          .filter(([__, v]) => v === '')
          .map(([k]) => k)
          .join(',');

        if (missingIds.length > 0) {
          return TE.left(
            new DataDiscrepancyError(
              `The following addresses don't have coingecko ids: ${missingIds}`,
            ),
          );
        }

        return TE.of(lookup);
      }),
      TE.chainW(({ lookup }) => {
        return TE.of(
          underlyingAssets.map((asset) => {
            const supply = new BigNumber(asset.supply.toString()).toNumber();
            const price: number | undefined =
              prices[asset.address.toLowerCase()]?.usd;
            return this.tokenRepository.save({
              chain: SupportedChain.ETHEREUM,
              address: asset.address,
              name: asset.name,
              symbol: asset.symbol,
              decimals: asset.decimals,
              coinGeckoId: lookup.get(asset.address),
              kind: 'token',
              marketData: price
                ? [
                    {
                      circulatingSupply: supply,
                      timestamp: new Date(),
                      currencyData: [
                        {
                          currency: 'usd',
                          marketCap: price * supply,
                          price: price,
                          nav: price,
                        },
                      ],
                    },
                  ]
                : [],
            });
          }),
        );
      }),
      TE.chainW((result) => TE.sequenceArray(result)),
    );
  }
}
