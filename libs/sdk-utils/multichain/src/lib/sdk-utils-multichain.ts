import { ContractWrapper, typesafeContract } from '@sdk-utils/core';
import { Contract, ContractInterface, ethers, Signer } from 'ethers';
import { promiseObject } from '@shared/helpers';
import { Provider } from '@ethersproject/providers';
import {
  ContractFunctions,
  MultiChainConfigOverrides,
  MultiChainReturnValue,
  MultiChainWrapperConfig,
} from './sdk-utils-multichain.types';

/**
 * The contract wrapper for multichain handles the global configuration
 * for all contracts wrapped.
 *
 * It's useful for defining a single set of global providers that can be shared
 * by all contracts.
 *
 * Pass the providers as a pairing of chainId: Provider to the constructor.
 * All contracts wrapped will then have the `withMultiChain` field enabled and will
 * return a multichain response
 */
export class MultiChainContractWrapper extends ContractWrapper<{
  withMultiChain: any;
}> {
  constructor(public config: MultiChainWrapperConfig) {
    super();
  }

  // @ts-ignore
  public create<C extends Contract>(
    address: string,
    abi: ContractInterface,
    signerOrProvider?: Signer | Provider,
    overrides?: MultiChainConfigOverrides,
  ): MultiChainReturnValue<C> {
    const contract = typesafeContract<C>(address, abi, signerOrProvider);
    return this.wrap(contract, overrides);
  }

  /**
   * When using multiple chains, we often need to point our contract
   * addresses to different locations, depending on the chain. Pass an override
   * when wrapping the contract to specific a different contract address for a particular chain.
   * @param contract the wrapped contract
   * @param overrides a list of providers and addresses, mapped to a chainId
   */
  public wrap<C extends Contract>(
    contract: C,
    overrides?: MultiChainConfigOverrides,
  ): MultiChainReturnValue<C> {
    const configAndOverrides = Object.entries(this.config).reduce(
      (obj, [chainId, config]) => {
        if (!chainId || !config) return;
        const curr = overrides && overrides[chainId];
        if (!curr) return;

        let newVal = {
          [chainId]: {
            ...config,
            ...curr,
          },
        };

        return { ...obj, ...newVal };
      },
      {} as MultiChainConfigOverrides,
    );

    return new MultichainContract(
      contract,
      configAndOverrides,
    ) as unknown as MultiChainReturnValue<C>;
  }
}

/**
 * Multichain contracts grab the list of functions from the contract
 * interface, and populate a `withMultichain` property on the contract instance
 * with said functions.
 *
 * Instead of calling the function as normal, we create ethers instances for each of the chains, so that
 * calls can be made to all chains simultaneously when prefixing with `withMultiChain`.
 */
class MultichainContract<T extends Contract> extends Contract {
  public withMultiChain = {} as ContractFunctions<T>;
  private _multichainConfig = {} as MultiChainConfigOverrides;

  private getInterfaceFunctions() {
    return Object.keys(this.interface.functions);
  }

  private stringNameInInterface(key: string) {
    const iFaceFunctions = this.getInterfaceFunctions();
    return (
      iFaceFunctions.includes(key) ||
      iFaceFunctions.map((i) => i.split('(')[0]).includes(key)
    );
  }

  private isContractFunction(
    key: string | number | symbol,
    value: any,
  ): boolean {
    if (typeof key !== 'string') return false;
    const isFunctionType = typeof value === 'function';
    const nameInInterface = this.stringNameInInterface(key);
    return isFunctionType && nameInInterface;
  }

  constructor(contract: T, config: MultiChainConfigOverrides) {
    super(
      contract.address,
      contract.interface,
      contract.signer ?? contract.provider,
    );

    this._multichainConfig = config;

    Object.entries(this).forEach(([key, value]) => {
      if (!this.isContractFunction(key, value)) return;

      const self = this;

      /**
       * Here we are iterating through the ABI and attaching the functions to the
       * `withMultiChain` property. This allows for typesafety and for a cross-chain return
       * type.
       */
      // @ts-ignore
      this.withMultiChain[key] = async function (args: any[]): Promise<any> {
        const configEnries = Object.entries(self._multichainConfig ?? []);
        const calls = configEnries.reduce((obj, [chainId, config]) => {
          const contract = new ethers.Contract(
            config.address ?? self.address,
            self.interface,
            config.provider ?? self.provider,
          );
          return { ...obj, [chainId]: <T>contract[key](args) };
        }, {});

        return await promiseObject({
          ...calls,
          original: value(args),
        });
      };
    });
  }
}
