import { ContractWrapper, typesafeContract } from '@sdk-utils/core';
import { Contract, ContractInterface, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import {
  MultiChainConfigOverrides,
  WrapMultichainContract,
  MultiChainWrapperConfig,
} from './types';
import { MultichainContract } from './contract';

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
interface MultiChainContractBaseProps {
  multichain: any;
  mc: any;
  _multichainConfig: MultiChainConfigOverrides | MultiChainWrapperConfig;
}
export class MultiChainContractWrapper extends ContractWrapper<MultiChainContractBaseProps> {
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
    contract: C | MultichainContract<C>,
    overrides?: MultiChainConfigOverrides,
  ): WrapMultichainContract<C> {
    // existing config will supersede the base config
    const existing = contract._multichainConfig ?? this.config;
    const configAndOverrides = this.combineConfigAndOverrides(
      overrides,
      existing,
    );
    return new MultichainContract(
      contract,
      configAndOverrides,
    ) as unknown as WrapMultichainContract<C>;
  }

  private applyOverride(
    chainId: string | number,
    overrides: MultiChainConfigOverrides,
    existing: MultiChainConfigOverrides | MultiChainWrapperConfig,
  ): MultiChainConfigOverrides | undefined {
    const override = overrides && overrides[chainId];
    const current = existing && existing[chainId];

    if (!current && !override) return;
    if (current && !override) return { [chainId]: current };
    if (!current && override) return { [chainId]: override };

    return { [chainId]: { ...current, ...override } };
  }

  public combineConfigAndOverrides(
    overrides?: MultiChainConfigOverrides,
    existing?: MultiChainConfigOverrides | MultiChainWrapperConfig,
  ): MultiChainConfigOverrides {
    const fallbackExisting = existing ?? this.config;
    if (!overrides) return fallbackExisting;
    const unique = this.uniqueKeys(overrides, fallbackExisting);
    return unique.reduce((combined, chainId) => {
      const newConfig = this.applyOverride(
        chainId,
        overrides,
        fallbackExisting,
      );
      return { ...combined, ...newConfig };
    }, {} as MultiChainConfigOverrides);
  }

  private uniqueKeys(
    a: Record<string, unknown>,
    b: Record<string, unknown>,
  ): string[] {
    return (
      [a, b]
        .map(Object.keys)
        .reduce((b, a) => [...b, ...a])
        // remove duplicates
        .filter((value, index, array) => array.indexOf(String(value)) === index)
    );
  }
}
