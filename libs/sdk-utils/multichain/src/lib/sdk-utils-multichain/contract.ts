import { Contract, ethers } from 'ethers';
import { promiseObjectAllSettled } from '@shared/helpers';
import {
  ContractFunctions,
  MultiChainConfigOverrides,
  MultiChainResponse,
  MultichainMeta,
  BaseMultiChainResponse,
} from './types';
import { ERRORS } from './errors';

/**
 * Multichain contracts grab the list of functions from the contract
 * interface, and populate a `withMultichain` property on the contract instance
 * with said functions.
 *
 * Instead of calling the function as normal, we create ethers instances for each of the chains, so that
 * calls can be made to all chains simultaneously when prefixing with `withMultiChain`.
 */
export class MultichainContract<T extends Contract> extends Contract {
  public multichain = {} as ContractFunctions<T>;
  public mc = {} as typeof this.multichain; // alias
  public _multichainConfig = {} as MultiChainConfigOverrides;

  private getInterfaceFunctions() {
    return Object.keys(this.interface.functions);
  }

  /**
   * The ABI contains a list of functions which we can attach to the
   * multichain proerty and safely override (without affecting the core contract behaviour).
   *
   * We first match the interface function name directly, but then, noting that
   * ethers supports both the `contract['method(args)'](args)` and contract.method(args) indexing
   * we also need to detect whether the function name matches.
   *
   * @dev ideally need a more robust way of detecting functions than looking for opening parentheses.
   *
   * @param key the property on the Contract class to check
   */
  private stringNameInInterface(key: string): boolean {
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
      // Here we are iterating through the ABI and attaching the functions to the withMultiChain property.
      // This allows for typesafety and for a cross-chain return type.
      // ts ignore due to dynamic assignment of object properties being near impossible to type.
      // @ts-ignore
      this.multichain[key as keyof ContractFunctions<T>] = async function (
        args: any,
      ): Promise<MultiChainResponse<T>> {
        const calls = self.setupContractCalls(key, args);
        const data = await promiseObjectAllSettled(calls);
        const meta = self.getMeta(data);
        if (meta.errors === meta.total)
          console.error('All contract calls failed');
        return { data, meta };
      };

      // set the alias
      this.mc = this.multichain;
    });
  }

  /**
   * Creates the contract calls as an object of promises pending execution.
   * This can be awaited using the promiseObject helper.
   * @param key the function name on on this contract
   * @param args the arguments to be passed to the contract call
   */
  private setupContractCalls(
    key: string,
    args: any,
  ): Promise<BaseMultiChainResponse<T>> {
    const configEntries = Object.entries(this._multichainConfig ?? []);
    return configEntries.reduce((obj, [chainId, config]) => {
      let res: Promise<BaseMultiChainResponse<T>>;

      if (!this.provider || !config.provider) throw ERRORS.NO_PROVIDER;
      if (!this.address || !config.address) throw ERRORS.MISSING_ADDRESS;

      // early return if the call should be excluded
      if (config && config.exclude) return obj;

      const contract: Contract = new ethers.Contract(
        config.address ?? this.address,
        this.interface,
        config.provider ?? this.provider,
      );

      // 'undefined' will serialise to unexpected calldata and throw an error
      if (args === undefined) {
        res = { ...obj, [chainId]: contract[key]() };
      } else {
        res = { ...obj, [chainId]: contract[key](args) };
      }
      return res;
    }, {} as Promise<BaseMultiChainResponse<T>>);
  }

  /**
   * Iterates through the results of a multichain contract call and creates a 'meta' option.
   *
   * @param results the results from the call.
   * @returns a meta object containing the total results, the number of 'fulfilled' results and the number of errors.
   */
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
