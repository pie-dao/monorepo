import { typesafeContract } from '@sdk-utils/core';
import { Erc20Abi } from '@shared/util-blockchain';
import { erc20 } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
import { MultiChainContractWrapper } from '../sdk-utils-multichain';

const ADDRESSES = {
  DOUGH: '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
  USDC_FTM: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  ZERO: ethers.constants.AddressZero,
  BURN: '0x000000000000000000000000000000000000dEaD',
};

describe('Testing the multichain', () => {
  jest.setTimeout(10_000);
  const contract = typesafeContract<Erc20Abi>(
    ADDRESSES.DOUGH,
    erc20,
    ethers.providers.getDefaultProvider(),
  );

  const multichain = new MultiChainContractWrapper({
    [1]: {
      provider: new ethers.providers.JsonRpcProvider(
        'https://rpc.ankr.com/eth',
      ),
    },
    [250]: {
      provider: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'),
    },
  });

  // Works when using different erc20s, so long as ABI is the same
  const wrapped = multichain.wrap(contract, {
    [1]: {
      address: ADDRESSES.DOUGH,
    },
    [250]: {
      address: ADDRESSES.USDC_FTM,
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
      ADDRESSES.DOUGH,
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

  it('Works with multiple arguments', async () => {
    const res = await wrapped.mc.allowance(ADDRESSES.ZERO, ADDRESSES.BURN);
    const { data } = res;

    if (data[1].status === 'fulfilled' && data[250].status === 'fulfilled') {
      expect(data[1].value).toEqual(
        await wrapped.allowance(ADDRESSES.ZERO, ADDRESSES.BURN),
      );
      expect(data['250'].status).toEqual('fulfilled');
      expect(data['250'].value.toNumber()).toEqual(0);
    } else {
      throw 'Test Failed';
    }
  });

  it('Works with no arguments', async () => {
    const res = await wrapped.mc.decimals();
    const { data } = res;

    if (data[1].status === 'fulfilled' && data[250].status === 'fulfilled') {
      expect(data[1].value).toEqual(await wrapped.decimals());
      expect(data['250'].status).toEqual('fulfilled');
      expect(data['250'].value).toEqual(6);
    } else {
      throw 'Test Failed';
    }
  });
});
