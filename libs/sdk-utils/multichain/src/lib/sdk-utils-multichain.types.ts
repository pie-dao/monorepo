import { Contract, ContractFunction } from 'ethers';
import { Provider } from '@ethersproject/providers';

export type MultiChainConfig = {
  provider?: Provider;
  address?: string;
};

export type MultiChainWrapperConfig = {
  [chainId: string | number]: Omit<MultiChainConfig, 'address'>;
};

export type MultiChainConfigOverrides =
  | {
      [chainId: string | number]: MultiChainConfig;
    }
  | undefined;

export type ContractFunctions<C extends Contract = Contract> = {
  [K in keyof C]: C[K] extends ContractFunction ? C[K] : never;
};

export type MultiChainResponse<R extends any> = {
  [chainId: number]: R;
} & { original: R };

export type FunctionWithMultiChainResponse<T> = ContractFunction<
  MultiChainResponse<Awaited<T>>
>;

export type MultichainContractFunctions<C extends Contract = Contract> = {
  [K in keyof C]: C[K] extends ContractFunction
    ? FunctionWithMultiChainResponse<ReturnType<C[K]>>
    : never;
};

export type MultiChainReturnValue<C extends Contract> = C & {
  withMultiChain: MultichainContractFunctions<C>;
};
