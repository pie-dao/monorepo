import { CoinGeckoAdapter } from '@domain/data-sync';
import { Provider } from '@ethersproject/providers';
import { DataTransferError, get } from '@hexworks/cobalt-http';
import {
  CurveMasterchefAbi,
  CurveMasterchefAbi__factory,
  Erc20Abi,
  Erc20Abi__factory,
} from '@shared/util-blockchain';
import { SupportedChain, SupportedCurrency } from '@shared/util-types';
import BigNumber from 'bignumber.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { YieldData } from '../../Strategy';
import { Token } from '../../Token';
import {
  APRBreakdown,
  APYBreakdown,
  CurveAPIError,
  EthersError,
  StrategyCalculationError,
  YieldVaultStrategy,
} from '../YieldVaultStrategy';

const MASTER_CHEF_ADDRESS = '0x0635AF5ab29Fc7bbA007B8cebAD27b7A3d3D1958';
const POOL_ADDRESS = '0x447646e84498552e62eCF097Cc305eaBFFF09308';
const POOL_ID = 0;

// 📘 curve has a fixed 0.4% percent fee for stable pools
const CURVE_FEE = 0.0004;
const STAKED_TOKEN_ID = 'qi-dao';
const SECONDS_PER_BLOCK = 2;
const HOURS_PER_YEAR = 168 * 52;
const SECONDS_PER_YEAR = 60 * 60 * HOURS_PER_YEAR;
const BASE_HPY = 2190; // * 👈 WTF is this?
const POOL_DECIMALS = '1e18';
const BEEFY_PERFORMANCE_FEE = 0.045;
const SHARE_AFTER_PERFORMANCE_FEE = 1 - BEEFY_PERFORMANCE_FEE;

export const MAI_POLYGON_STRATEGY_KIND = 'MAI+3Pool3CRV-f';

const API_URL = 'https://api.curve.fi/api/getFactoryAPYs-polygon';

const POOL_DETAILS_CODEC = t.strict({
  index: t.number,
  poolAddress: t.string,
  poolSymbol: t.string,
  apyFormatted: t.string,
  apy: t.number,
  apyWeekly: t.number,
  virtualPrice: t.number,
  volume: t.number,
});

type PoolDetails = t.TypeOf<typeof POOL_DETAILS_CODEC>;

const CURVE_API_CODEC = t.strict({
  success: t.boolean,
  data: t.strict({
    poolDetails: t.array(POOL_DETAILS_CODEC),
    totalVolume: t.number,
    generatedTimeMs: t.number,
  }),
});

// TODO: separate the data (strategy metadata) from business logic (strategy implementation)
export class MaiPolygonStrategy implements YieldVaultStrategy {
  public kind = MAI_POLYGON_STRATEGY_KIND;
  public name = this.kind;
  public chain = SupportedChain.POLYGON;

  private masterChefContract: CurveMasterchefAbi;
  private poolContract: Erc20Abi;

  constructor(
    public address: string, // TODO: we should fill this in as a constant
    public underlyingToken: Token,
    public trusted: boolean,
    public vaults: string[] = [],
    public yields: YieldData[] = [],
    private cg: CoinGeckoAdapter,
    private provider: Provider,
  ) {
    this.masterChefContract = CurveMasterchefAbi__factory.connect(
      MASTER_CHEF_ADDRESS,
      this.provider,
    );
    this.poolContract = Erc20Abi__factory.connect(POOL_ADDRESS, this.provider);
  }

  calculateAPR(): TE.TaskEither<StrategyCalculationError, APRBreakdown> {
    return pipe(
      TE.Do,
      TE.apS(
        'blockRewards',
        this.wrapEthersCall(this.masterChefContract.rewardPerBlock()),
      ),
      TE.apS(
        'totalAllocationPoints',
        this.wrapEthersCall(this.masterChefContract.totalAllocPoint()),
      ),
      TE.apS(
        'poolInfo',
        this.wrapEthersCall(this.masterChefContract.poolInfo(POOL_ID)),
      ),
      TE.apS(
        'poolBalance',
        this.wrapEthersCall(this.poolContract.balanceOf(MASTER_CHEF_ADDRESS)),
      ),
      TE.apSW('poolDetails', this.fetchCurvePoolDetails()),
      TE.apSW('stakedTokenPrice', this.fetchStakedTokenPrice('usd')),
      TE.map(
        ({
          blockRewards,
          totalAllocationPoints,
          poolInfo,
          poolBalance,
          poolDetails,
          stakedTokenPrice,
        }) => {
          return {
            blockRewards: new BigNumber(blockRewards.toString()),
            totalAllocationPoints: new BigNumber(
              totalAllocationPoints.toString(),
            ),
            poolBalance: new BigNumber(poolBalance.toString()),
            allocationPoints: new BigNumber(poolInfo.allocPoint.toString()),
            tradingAPR: new BigNumber(poolDetails.apy)
              .dividedBy(100)
              .times(SHARE_AFTER_PERFORMANCE_FEE)
              .toNumber(),
            lpPrice: new BigNumber(poolDetails.virtualPrice).dividedBy(
              POOL_DECIMALS,
            ),
            stakedTokenPrice: new BigNumber(stakedTokenPrice.toString()),
          };
        },
      ),
      TE.map(
        ({
          blockRewards,
          totalAllocationPoints,
          poolBalance,
          allocationPoints,
          lpPrice,
          stakedTokenPrice,
          tradingAPR,
        }) => {
          const totalStakedInUsd = poolBalance
            .times(lpPrice)
            .dividedBy(POOL_DECIMALS);

          const poolBlockRewards = blockRewards
            .times(allocationPoints)
            .dividedBy(totalAllocationPoints);

          const yearlyRewards = poolBlockRewards
            .dividedBy(SECONDS_PER_BLOCK)
            .times(SECONDS_PER_YEAR);

          const yearlyRewardsInUsd = yearlyRewards
            .times(stakedTokenPrice)
            .dividedBy(POOL_DECIMALS);

          const farmingAPR = yearlyRewardsInUsd
            .dividedBy(totalStakedInUsd)
            .times(SHARE_AFTER_PERFORMANCE_FEE)
            .toNumber();

          const totalAPR = farmingAPR + tradingAPR;

          return {
            tradingAPR,
            farmingAPR,
            totalAPR,
          };
        },
      ),
    );
  }

  simulateAPY(
    compoundingFrequency: number = BASE_HPY,
    years = 1,
  ): TE.TaskEither<StrategyCalculationError, APYBreakdown> {
    return pipe(
      this.calculateAPR(),
      TE.map(({ tradingAPR, farmingAPR, totalAPR }) => {
        const farmingAPY = this.compound(
          farmingAPR,
          compoundingFrequency,
          years,
        );

        const tradingAPY = this.compound(
          tradingAPR,
          compoundingFrequency,
          years,
        );

        const totalAPY = farmingAPY + tradingAPY;

        return {
          tradingAPR,
          farmingAPR,
          totalAPR,
          tradingAPY,
          farmingAPY,
          totalAPY,
        };
      }),
    );
  }

  private compound(rate: number, compopundings = 365, years: number) {
    return (1 + rate / compopundings) ** (compopundings * years) - 1;
  }

  private fetchStakedTokenPrice(currency: SupportedCurrency) {
    return pipe(
      this.cg.getCoinMetadata(STAKED_TOKEN_ID),
      TE.map(({ market_data }) => market_data.current_price[currency]),
    );
  }

  private fetchCurvePoolDetails(): TE.TaskEither<
    CurveAPIError | DataTransferError,
    PoolDetails
  > {
    return pipe(
      get(API_URL, CURVE_API_CODEC),
      TE.map(({ data }) => data.poolDetails),
      TE.chainW((poolDetails) => {
        const pool = poolDetails.find((it) => it.poolAddress === POOL_ADDRESS);
        if (!pool) {
          return TE.left(new CurveAPIError(MAI_POLYGON_STRATEGY_KIND));
        }
        return TE.of(pool);
      }),
    );
  }

  private wrapEthersCall<T>(
    promise: Promise<T>,
  ): TE.TaskEither<EthersError, T> {
    return TE.tryCatch(
      () => promise,
      (cause) => new EthersError(cause),
    );
  }
}
