import { ContractWrapper, typesafeContract } from '@sdk-utils/core';
import { Contract, ContractInterface, ethers, Signer } from 'ethers';
import { promiseObjectAllSettled } from '@shared/helpers';
import { Provider } from '@ethersproject/providers';
import {
  ContractFunctions,
  MultiChainConfigOverrides,
  WrapMultichainContract,
  MultiChainWrapperConfig,
  MultiChainConfig,
  MultiChainResponse,
  MultichainMeta,
  BaseMultiChainResponse,
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
  multichain: any;
  mc: any;
  _multichainConfig: MultiChainConfigOverrides | MultiChainWrapperConfig;
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
  ): WrapMultichainContract<C> {
    const contract = typesafeContract<C>(address, abi, signerOrProvider);
    return this.wrap(contract, overrides);
  }

  /**
   * When using multiple chains, we often need to add different settings, such as addresses.
   * Pass an override when wrapping the contract to specific a different contract address for a particular chain.
   *
   * @param contract the wrapped contract.
   * @param overrides a list of providers and addresses, mapped to a chainId.
   */
  public wrap<C extends Contract>(
    contract: C,
    overrides?: MultiChainConfigOverrides,
  ): WrapMultichainContract<C> {
    const configAndOverrides = this.combineConfigAndOverrides(overrides);

    return new MultichainContract(
      contract,
      configAndOverrides,
    ) as unknown as WrapMultichainContract<C>;
  }

  private static isEmptyObject(record: object | undefined): boolean {
    return Boolean(record) && Object.entries(record as object).length > 0;
  }

  private applyOverride(
    chainId: string | number,
    override: MultiChainConfig,
  ): MultiChainConfigOverrides | undefined {
    // find the any existing config

    console.debug('Entering for chain', chainId, override);

    const existingConfig = this.config[chainId];
    const overrideConfig = !MultiChainContractWrapper.isEmptyObject(override);

    console.debug({ chainId, existingConfig, overrideConfig });

    if (!existingConfig && !overrideConfig) return;

    if (existingConfig && !overrideConfig) return { [chainId]: existingConfig };

    if (!existingConfig && overrideConfig) return { [chainId]: override };

    console.debug({ existingConfig, override });
    return {
      [chainId]: {
        ...existingConfig,
        ...override,
      },
    };
  }

  public combineConfigAndOverrides(
    overrides?: MultiChainConfigOverrides,
  ): MultiChainConfigOverrides {
    if (!overrides) return this.config;
    return Object.entries(overrides).reduce((combined, [chainId, override]) => {
      console.debug({ overrides });
      const newConfig = this.applyOverride(chainId, override);
      return { ...combined, ...newConfig };
    }, {} as MultiChainConfigOverrides);
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
  public multichain = {} as ContractFunctions<T>;
  public mc = {} as typeof this.multichain; // alias
  public _multichainConfig = {} as MultiChainConfigOverrides;

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
      this.multichain[key as keyof ContractFunctions<T>] = async function (
        args: any,
      ): Promise<MultiChainResponse<T>> {
        const calls = self.setupContractCalls(key, args);
        const results = await promiseObjectAllSettled(calls);

        const meta = { meta: self.getMeta(results) };
        return {
          ...results,
          ...meta,
        };
      };

      // set the alias
      this.mc = this.multichain;
    });
  }

  // public static unwrap(): {};
  private setupContractCalls(
    key: string,
    args: any,
  ): Promise<BaseMultiChainResponse<T>> {
    const configEntries = Object.entries(this._multichainConfig ?? []);
    return configEntries.reduce((obj, [chainId, config]) => {
      // early return if the call should be excluded
      if (config && config.exclude) return obj;

      const contract = new ethers.Contract(
        config.address ?? this.address,
        this.interface,
        config.provider ?? this.provider,
      );
      return { ...obj, [chainId]: contract[key](args) };
    }, {} as Promise<BaseMultiChainResponse<T>>);
  }

  private getMeta<T extends Contract>(
    results: BaseMultiChainResponse<T>,
  ): MultichainMeta {
    return Object.values(results).reduce(
      (meta, result) => {
        meta.total++;
        result.status === 'fulfilled' ? meta.ok++ : meta.errors++;
        return meta;
      },
      {
        errors: 0,
        ok: 0,
        total: 0,
      } as MultichainMeta,
    );
  }
}
