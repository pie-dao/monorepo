import { BigNumber, ethers } from 'ethers';
import { Erc20Abi as ERC20 } from '@shared/util-blockchain';
import { erc20 } from '@shared/util-blockchain/abis';
import { MultiCallWrapper } from '../lib/sdk-utils-multicall';
import { promiseObject } from '@shared/helpers';

// 🐋🐋🐋🐋🐋🐋🐋🐋🐋
const USDCholders = [
  '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
  '0x12edea9cd262006cc3c4e77c90d2cd2dd4b1eb97',
  '0xe61dd9ca7364225afbfb79e15ad33864424e6ae4',
  '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',
  '0x083dee8e5ca1e100a9c9ec0744f461b3507e9376',
  '0xcb54ea94191b280c296e6ff0e37c7e76ad42dc6a',
];

// Use a provider other than default (i.e. with FTM)
export async function main() {
  const ftmProvider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ftm.tools​',
  );
  const multicall = new MultiCallWrapper(ftmProvider);

  const usdc = {
    address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    abi: erc20,
  };

  const usdcContract = multicall.create<ERC20>(usdc.address, usdc.abi);

  // aggregate calls
  const calls = USDCholders.reduce(
    (obj, holder) => ({
      ...obj,
      [holder]: usdcContract.balanceOf(holder),
    }),
    {} as Record<string, Promise<BigNumber>>,
  );

  const dec = { decimals: usdcContract.decimals() };
  const newCalls = { ...calls, ...dec } as typeof calls & typeof dec;

  // fire through a promise all call
  // this will trigger the multicall to batch calls
  const results = await promiseObject(newCalls);

  // paste results
  Object.entries(results).forEach(([holder, quantity]) => {
    if (typeof quantity !== 'number') {
      console.log(
        'holder:',
        holder,
        'quantity',
        // human readable
        quantity.div(BigNumber.from(10).pow(results.decimals)).toNumber(),
      );
    }
  });
}
