import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ethers } from 'ethers';
import filter from 'lodash/filter';
import { promiseObject } from '../../utils/promiseObject';
import { toBalance } from '../../utils/calculateAPY';
import {
  contractWrappers,
  FTMContractWrappers,
  PolygonContractWrappers,
} from './products.contracts';
import { EnrichedProduct, Vault, Vaults } from './products.types';

export const THUNKS = {
  GET_PRODUCTS_DATA: 'app/getProductsData',
  GET_VAULTS_DATA: 'app/getVaultsData',
  GET_USER_VAULTS_DATA: 'app/getUserVaultsData',
};

const sum = (x: ethers.BigNumber, y: ethers.BigNumber) => x.add(y);
const sumBalance = (x: number, y: number) => x + y;

export const thunkGetProductsData = createAsyncThunk(
  THUNKS.GET_PRODUCTS_DATA,
  async (account: string) => {
    if (!account) return;
    const productDataResults = await Promise.allSettled(
      contractWrappers.map((contractWrapper) => {
        const results = promiseObject({
          balances: contractWrapper.multichain.balanceOf(account),
          productDecimals: contractWrapper.decimals(),
          symbol: contractWrapper.symbol(),
        });
        return results;
      }),
    );

    const enrichWithTotalBalance = productDataResults.map(
      (result): EnrichedProduct => {
        if (result.status === 'fulfilled') {
          const { data } = result.value.balances;
          const filterFulfilled = Object.values(data).filter(
            (value) => value.status === 'fulfilled',
          ) as PromiseFulfilledResult<BigNumber>[];
          const totalBalanceBN = filterFulfilled
            .map((balance) => balance.value)
            .reduce(sum, ethers.constants.Zero);
          const totalBalance = ethers.utils.formatUnits(
            totalBalanceBN,
            result.value.productDecimals,
          );

          const balances = Object.entries(result.value.balances.data).filter(
            ([, value]) => value.status === 'fulfilled',
          ) as [string, PromiseFulfilledResult<BigNumber>][];

          const balancesFormatted = balances.map(([key, amount]) => ({
            [key]: amount.value.toString(),
          }));

          return {
            [result.value.symbol]: {
              balances: Object.assign({}, ...balancesFormatted),
              productDecimals: result.value.productDecimals,
              totalBalance,
            },
          };
        }
      },
    );

    const totalBalances = enrichWithTotalBalance
      .map((result) => {
        return Number(Object.values(result)[0].totalBalance);
      })
      .reduce(sumBalance, 0);

    const tokens = Object.assign({}, ...enrichWithTotalBalance);

    const networksUsed = enrichWithTotalBalance.map((result) => {
      return Object.values(result)[0].balances;
    });

    const uniqueNetworksPerChain = Object.assign(
      {},
      ...Object.values(networksUsed),
    );

    const uniqueNetworks = filter(
      uniqueNetworksPerChain,
      (value) => Number(value) !== 0,
    ).length;

    const totalAssets = enrichWithTotalBalance.filter((result) => {
      return Object.values(result)[0].totalBalance !== '0.0';
    }).length;

    return {
      tokens,
      uniqueNetworks,
      totalAssets,
      totalBalances,
    };
  },
);

export const thunkGetVaultsData = createAsyncThunk(
  THUNKS.GET_VAULTS_DATA,
  async () => {
    const vaultsData = [
      ...PolygonContractWrappers.map((auxo) => {
        const results = promiseObject({
          totalUnderlying: auxo.totalUnderlying(),
          underlyingDecimals: auxo.underlyingDecimals(),
          lastHarvest: auxo.lastHarvest(),
          estimatedReturn: auxo.estimatedReturn(),
          batchBurnRound: auxo.batchBurnRound(),
          userDepositLimit: auxo.userDepositLimit(),
          exchangeRate: auxo.exchangeRate(),
          name: auxo.name(),
          decimals: auxo.decimals(),
          symbol: auxo.symbol(),
          chainId: 250,
          address: auxo.address,
        });
        return results;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const results = promiseObject({
          totalUnderlying: ftm.totalUnderlying(),
          underlyingDecimals: ftm.underlyingDecimals(),
          lastHarvest: ftm.lastHarvest(),
          estimatedReturn: ftm.estimatedReturn(),
          batchBurnRound: ftm.batchBurnRound(),
          userDepositLimit: ftm.userDepositLimit(),
          exchangeRate: ftm.exchangeRate(),
          name: ftm.name(),
          decimals: ftm.decimals(),
          symbol: ftm.symbol(),
          chainId: 137,
          address: ftm.address,
        });
        return results;
      }),
    ];

    const resolvedVaults = await Promise.allSettled(vaultsData);

    const orderedVaults = Object.values(resolvedVaults).map((result) => {
      if (result.status === 'fulfilled') {
        const filterFulfilled = {
          [result.value.name]: {
            decimals: result.value.decimals,
            underlyingDecimals: result.value.underlyingDecimals,
            totalDeposited: toBalance(
              result.value.totalUnderlying.toString(),
              result.value.underlyingDecimals,
              0,
            ),
            lastHarvest: result.value.lastHarvest.toString(),
            estimatedReturn: toBalance(
              result.value.estimatedReturn.toString(),
              result.value.decimals,
              2,
            ),
            batchBurnRound: result.value.batchBurnRound.toString(),
            userDepositLimit: result.value.userDepositLimit.toString(),
            exchangeRate: result.value.exchangeRate.toString(),
            symbol: result.value.symbol,
            name: result.value.name,
            chainId: result.value.chainId,
            address: result.value.address,
          },
        };
        return filterFulfilled;
      }
    });
    return Object.assign({}, ...orderedVaults);
  },
);

export const thunkGetUserVaultsData = createAsyncThunk(
  THUNKS.GET_USER_VAULTS_DATA,
  async (account: string) => {
    if (!account) return;
    const vaultsData = [
      ...PolygonContractWrappers.map((auxo) => {
        const results = promiseObject({
          balance: auxo.balanceOf(account),
          name: auxo.name(),
          chainId: 137,
          decimals: auxo.decimals(),
        });
        return results;
      }),
      ...FTMContractWrappers.map((ftm) => {
        const results = promiseObject({
          balance: ftm.balanceOf(account),
          name: ftm.name(),
          chainId: 250,
          decimals: ftm.decimals(),
        });
        return results;
      }),
    ];

    const resolvedVaults = await Promise.allSettled(vaultsData);
    const orderedVaults = Object.values(resolvedVaults).map((result) => {
      if (result.status === 'fulfilled') {
        const filterFulfilled = {
          [result.value.name]: {
            balance: result.value.balance.toString(),
            name: result.value.name,
            chainId: result.value.chainId,
            decimals: result.value.decimals,
          },
        };
        return filterFulfilled;
      }
    });

    const vaults = Object.assign({}, ...orderedVaults) as Vaults;

    const totalAssets = Object.values(vaults).filter((value) => {
      return value.balance !== '0';
    }) as Vault[];

    const totalBalances = totalAssets
      .map((result) => {
        return Number(
          ethers.utils.formatUnits(result.balance, result.decimals),
        );
      })
      .reduce(sumBalance, 0);

    const chainUsed = totalAssets.map((result) => {
      return result.chainId;
    });

    return {
      vaults,
      totalAssets: totalAssets.length,
      totalBalances,
      chainUsed: [...new Set(chainUsed)].length,
    };
  },
);
