import { ContractWrapper, decorate } from '@sdk-utils/core';
import { providers as _0xS } from '@0xsequence/multicall';
import { Contract, ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';

/**
 * Multicall implementation with 0xSequence happens automatically.
 * There are no special methods to call, but we add this flag purely as an indicator to show the contract has been wrapped.
 */
type Multicall = {
  isMulticallEnabled: boolean;
};

/**
 * We need to extend the internal provider to get type inference on multicall provider properties.
 */
type WrapMulticallProvder<C extends Contract> = C & {
  provider: MulticallProvider;
};

/**
 * A list of contract addresses for multicall, on different networks.
 *
 * Visit [The 0xSequence Multicall page](https://github.com/0xsequence/sequence.js/tree/master/packages/multicall) for details.
 */
export const MULTICALLCONTRACTS = {
  // Put deployed contracts here
  1: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
};

export class MultiCallWrapper extends ContractWrapper<Multicall> {
  // Set in the constructor through the set function
  private multicallProvider!: _0xS.MulticallProvider;
  public contracts: Contract[] = [];

  constructor(provider?: Provider) {
    super();
    this.setMulticallProvider(provider);
  }

  /**
   * Wraps the existing provider in the 0x Multicall provider.
   * Batch calls together with Promise.all to execute through multicall.
   * Alternatively, see the [The 0xSequence Multicall page](https://github.com/0xsequence/sequence.js/tree/master/packages/multicall) page for usage details.
   * @param provider an ethers provider.
   */
  private setMulticallProvider(provider: undefined | Provider) {
    const actualProvider = this.getProvider(provider);
    this.multicallProvider = new _0xS.MulticallProvider(actualProvider);
  }

  private getProvider(provider: undefined | Provider): Provider {
    return provider ?? ethers.providers.getDefaultProvider();
  }

  /**
   * Reconnects to the contract with the multicall provider and adds the multicall decorator.
   * @returns the original contract with the multichain indicator added.
   */
  public wrap<C extends Contract>(
    contract: C,
  ): WrapMulticallProvder<C> & Multicall {
    const multicallEnabledContract = contract.connect(
      this.multicallProvider,
    ) as WrapMulticallProvder<C>;

    return decorate(multicallEnabledContract, { isMulticallEnabled: true });
  }
}
