import { typesafeContract } from '@sdk-utils/core';
import { Erc20Abi, SmartpoolAbi__factory } from '@shared/util-blockchain';
import { erc20 as erc20Abi } from '@shared/util-blockchain/abis';
import { ContractInterface, ethers } from 'ethers';
import { MultichainProvider, MultiChainWrapper } from './sdk-utils-multichain';

describe('Testing Multichain', () => {
  describe('Connecting', () => {
    it('Allows the connection of multiple providers through an array of chain ids', () => {});

    it('Allows passing more complex arguments as providers', () => {});
  });

  describe('Data Fetching', () => {
    it('Returns the chain calls if executed with the multichain call option', async () => {});

    it('Saves the chain data against the multichain property', async () => {});
  });

  describe('Multicall integration', () => {
    it('Works with the multicall plugin', () => {});
  });
});

describe('Testing the dummy', () => {
  it('works', async () => {
    const provider = new ethers.providers.JsonRpcProvider();

    const multichainProvider = new MultichainProvider(provider);

    const address = '0xad32A8e6220741182940c5aBF610bDE99E737b2D'; // DOUGH
    const contract = typesafeContract<Erc20Abi>(
      address,
      erc20Abi,
      multichainProvider,
    );

    const decimals = await contract.decimals();
    console.debug(decimals.toString());
  });
});
