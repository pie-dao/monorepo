import { createAsyncThunk } from '@reduxjs/toolkit';
import { MultiChainContractWrapper } from '@sdk-utils/multichain';
import { Erc20Abi__factory } from '@shared/util-blockchain';
import { ethers } from 'ethers';
import { config, SupportedChains } from '../../utils/networks';
import { promiseObject } from '../../utils/promiseObject';

const mcw = new MultiChainContractWrapper(config);

const contract = Erc20Abi__factory.connect(
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  ethers.getDefaultProvider(),
);

const USDC_ADDRESSES = {
  137: { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' },
  250: { address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75' },
  41334: { address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e' },
  11: { address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607' },
  42161: { address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' },
  100: { address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83' },
};

const contractWrapper = mcw.wrap(contract, USDC_ADDRESSES);

export const THUNKS = {
  GET_PRODUCTS_DATA: 'app/getProductsData',
};

type BigNumberString = string;
type ChainValue = [SupportedChains, BigNumberString];

type ThunkGetProductsDataProps = {
  account?: string;
};
export const thunkGetProductsData = createAsyncThunk(
  THUNKS.GET_PRODUCTS_DATA,
  async ({ account }: ThunkGetProductsDataProps) => {
    const productBalance = contractWrapper.multichain.balanceOf(account);
    const productDecimals = contractWrapper.decimals();
    const symbol = contractWrapper.symbol();

    const results = await promiseObject({
      symbol,
      productBalance,
      productDecimals,
    });

    const chainBalances: ChainValue[] = [];

    for (const [chain, response] of Object.entries(
      results.productBalance.data,
    )) {
      if (response.status === 'fulfilled') {
        chainBalances.push([
          Number(chain) as SupportedChains,
          response.value.toString(),
        ]);
      }
    }

    return {
      [results.symbol]: {
        balances: chainBalances,
        decimals: results.productDecimals,
      },
    };
  },
);
