import { Contract, ContractFunction } from 'ethers';
import { Provider } from '@ethersproject/providers';

/**
 * When instantiating a multichain contract, we pass a configuration object
 * containing additional information required to make multichain calls:
 *
 * @provider is the ethers provider that will be used for the multichain call (can be a wrapped provider)
 * @rpcUrl will instantiate a basic JSON-RPC provider
 * @address is the contract address on the relevant chain. There is no compile time checking here, so it is up to the user to check the address is correct.
 */
export type MultiChainConfig = {
  provider?: Provider;
  rpcUrl?: string;
  address?: string;
};

/**
 * We probably want to keep providers consistent across contracts, in which case you can set options at the wrapper level, and it will apply to all contracts.
 * For obvious reasons, you cannot set the address across all contracts.
 */
export type MultiChainWrapperConfig = {
  [chainId: string | number]: Omit<MultiChainConfig, 'address'>;
};

/**
 * Optionally pass any configuration options on a per-contract basis, for each chain typically this would be the address but it is not mandatory.
 */
export type MultiChainConfigOverrides =
  | {
      [chainId: string | number]: MultiChainConfig;
    }
  | undefined;

/**
 * We currently only support multichain function calls, so this simply reduces the possible multichain call options to function calls from the abi
 */
export type ContractFunctions<C extends Contract = Contract> = {
  [K in keyof C]: C[K] extends ContractFunction ? C[K] : never;
};

type Err = string;
export type Maybe<R> = R | Err;

/**
 * @R is the original response from the original chain.
 * Multichain calls may return errors in which case they will be indicated against the chainId
 *
 * @TODO more formally define the err-response
 */
export type MultiChainResponse<R extends any> = {
  [chainId: number]: Maybe<R>;
} & { original: R };

/**
 * Map each original contract function to return its original (Awaited) response, wrapped by the multichain info.
 */
export type FunctionWithMultiChainResponse<T> = ContractFunction<
  MultiChainResponse<Awaited<T>>
>;

/**
 * Only define multichain responses for properties defined by the ABI as functions.
 */
export type MultichainContractFunctions<C extends Contract = Contract> = {
  [K in keyof C]: C[K] extends ContractFunction
    ? FunctionWithMultiChainResponse<ReturnType<C[K]>>
    : never;
};

/**
 * Extend an ethers Contract instance with the `multichain` property, allowing it to be called across multiple chains.
 * Also add a shorthand alias `mc` for lazy people.
 */
export type WrapMultichainContract<C extends Contract> = C & {
  multichain: MultichainContractFunctions<C>;
  mc: MultichainContractFunctions<C>;
};
