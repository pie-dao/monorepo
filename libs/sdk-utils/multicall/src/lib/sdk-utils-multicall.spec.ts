import { typesafeContract } from '@sdk-utils/core';
import { Erc20Abi as Erc20 } from '@shared/util-blockchain';
import { erc20 as erc20Abi } from '@shared/util-blockchain/abis';
import { ethers } from 'ethers';
import { MultiCallWrapper } from './sdk-utils-multicall';

describe('Multicall Wrapper testing', () => {
  const multicall = new MultiCallWrapper();
  const address = '0xad32A8e6220741182940c5aBF610bDE99E737b2D'; // DOUGH
  const contract = typesafeContract<Erc20>(address, erc20Abi);
  const multicallDough = multicall.wrap(contract);

  describe('Testing the multicall instantiation', () => {
    it('Should wrap an existing contract', () => {
      expect(multicallDough.isMulticallEnabled).toEqual(true);
    });

    it('Should be able to call the same methods', async () => {
      const decimals = await multicallDough.decimals();
      expect(decimals).toEqual(18);
    });

    it('Should create a new instance of a multicall enabled contract, when passed params', () => {
      const newMulticallDough = multicall.create<Erc20>(address, erc20Abi);
      expect(newMulticallDough.isMulticallEnabled).toEqual(true);
    });
  });

  describe('Making multicalls through the multicall contract', () => {
    it('Batches multiple calls as one call through the multicall contract', async () => {
      // access private variables in TS through string notation
      const spy = jest.spyOn(multicallDough.provider['multicall'], 'run');

      await Promise.all([
        multicallDough.decimals(),
        multicallDough.balanceOf(ethers.constants.AddressZero),
      ]);

      expect(spy).toBeCalledTimes(1);
    });

    it('Runs individual await calls as separate calls', async () => {
      const spy = jest.spyOn(multicallDough.provider['multicall'], 'run');

      await multicallDough.decimals();
      await multicallDough.decimals();

      // add the first call for a total of 3
      // resetting mocks causes timeout error, not ideal but easier than debugging jest internals
      expect(spy).toBeCalledTimes(3);
    });
  });
});
