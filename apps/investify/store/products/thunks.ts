import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ethers } from 'ethers';
import { promiseObject } from '../../utils/promiseObject';
import { contractWrappers } from './product.contracts';

export const THUNKS = {
  GET_PRODUCTS_DATA: 'app/getProductsData',
};

type ThunkGetProductsDataProps = {
  account?: string;
};

const sum = (x: ethers.BigNumber, y: ethers.BigNumber) => x.add(y);

export const thunkGetProductsData = createAsyncThunk(
  THUNKS.GET_PRODUCTS_DATA,
  async ({ account }: ThunkGetProductsDataProps) => {
    if (!account) return;
    const productDataResults = await Promise.allSettled(
      contractWrappers.map(async (contractWrapper) => {
        const results = await promiseObject({
          balances: contractWrapper.multichain.balanceOf(
            '0xd1e4a32679216f4a4dd38e45dab9bc4b8a45e592',
          ),
          productDecimals: contractWrapper.decimals(),
          symbol: contractWrapper.symbol(),
        });
        return results;
      }),
    );

    const enrichWithTotalBalance = productDataResults.map((result) => {
      if (result.status === 'fulfilled') {
        const { data } = result.value.balances;
        const filterFulfilled = Object.values(data).filter(
          (value) => value.status === 'fulfilled',
        ) as PromiseFulfilledResult<BigNumber>[];

        const totalBalance = ethers.utils.formatUnits(
          filterFulfilled.map((balance) => balance.value).reduce(sum),
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
    });

    const networksUsed = enrichWithTotalBalance.map((result) => {
      return Object.keys(Object.values(result)[0].balances);
    });

    const uniqueNetworks = [...new Set(networksUsed.flat())].length;
    const totalAssets = enrichWithTotalBalance.filter((result) => {
      return Object.values(result)[0].totalBalance !== '0.0';
    }).length;

    return Object.assign({}, ...enrichWithTotalBalance, {
      uniqueNetworks,
      totalAssets,
    });
  },
);
