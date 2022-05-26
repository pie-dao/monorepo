import { typesafeContract } from '@sdk-utils/core';
import { Erc20Abi } from '@shared/util-blockchain';
import { erc20 } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
import { MultiChainContractWrapper } from './sdk-utils-multichain';

describe('Testing the multichain', () => {
  jest.setTimeout(10_000);
  const contract = typesafeContract<Erc20Abi>(
    '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    erc20,
    ethers.providers.getDefaultProvider(),
  );

  const multichain = new MultiChainContractWrapper({
    1: {
      provider: ethers.providers.getDefaultProvider(),
      address: '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    },
    250: {
      provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'),
      address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    },
  });
  const wrapped = multichain.wrap(contract);

  it('creates a multichain contract that can return a single value normally', async () => {
    const created = multichain.create<Erc20Abi>(
      '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
      erc20,
      ethers.providers.getDefaultProvider(),
    );

    const balanceWrapped = await wrapped.balanceOf(
      ethers.constants.AddressZero,
    );
    const balanceCreated = await created.balanceOf(
      ethers.constants.AddressZero,
    );

    expect(balanceWrapped).toEqual(balanceCreated);

    // would not work if it were an object
    expect(balanceWrapped._isBigNumber).toBe(true);
  });

  it('Can return a multicall response', async () => {
    const res = await wrapped.withMultiChain.balanceOf(
      ethers.constants.AddressZero,
    );

    // @ts-ignore - need to type the return value
    expect(res._isBigNumber).toBe(undefined);

    // @ts-ignore
    expect(res['250'].gt(0)).toEqual(true);
  });
});
