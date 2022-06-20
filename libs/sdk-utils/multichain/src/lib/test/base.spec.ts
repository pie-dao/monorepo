import { typesafeContract } from '@sdk-utils/core';
import { Erc20Abi } from '@shared/util-blockchain';
import { erc20 } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
import { MultiChainContractWrapper } from '../sdk-utils-multichain';

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
    },
    250: {
      provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'),
    },
  });

  // Works when using different erc20s, so long as ABI is the same
  const wrapped = multichain.wrap(contract, {
    1: {
      address: '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    },
    250: {
      address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    },
    [11]: {
      provider: new ethers.providers.JsonRpcProvider(
        'https://mainnet.optimism.io',
      ),
    },
    [137]: {
      provider: new ethers.providers.JsonRpcProvider('https://polygon-rpc.com'),
    },
  });

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
    expect(balanceWrapped._isBigNumber).toBe(true);
  });

  it('Can return a multicall response', async () => {
    const { data } = await wrapped.multichain.balanceOf(
      ethers.constants.AddressZero,
    );

    if (data[1].status === 'fulfilled' && data[250].status === 'fulfilled') {
      expect(data[1].value).toEqual(
        await wrapped.balanceOf(ethers.constants.AddressZero),
      );
      expect(data['250'].status).toEqual('fulfilled');
      expect(data['250'].value.gt(0)).toEqual(true);
      expect(data[250].value).not.toEqual(data[1].value);
    }
  });

  it('Can return a multicall response using the alias', async () => {
    const res = await wrapped.mc.balanceOf(ethers.constants.AddressZero);
    const { data } = res;

    if (data[1].status === 'fulfilled' && data[250].status === 'fulfilled') {
      expect(data[1].value).toEqual(
        await wrapped.balanceOf(ethers.constants.AddressZero),
      );
      expect(data['250'].status).toEqual('fulfilled');
      expect(data['250'].value.gt(0)).toEqual(true);
    }
  });
});