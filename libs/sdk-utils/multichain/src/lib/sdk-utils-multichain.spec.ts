import { ContractInterface, ethers } from 'ethers';

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
  class MC extends ethers.Contract {
    public withMultichain(chains: number[]) {
      return {
        ...this,
        multichain: {},
      };
    }
  }

  class Dummy extends ethers.Contract {
    public multiChain = new MC('', '');

    public withMultichain() {
      return this.multichain;
    }
  }

  type ExtraData = { og: string; num: number } | {};
});
