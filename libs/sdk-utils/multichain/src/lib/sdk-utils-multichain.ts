import { ContractWrapper, typesafeContract } from '@sdk-utils/core';
import {
  Contract,
  ContractFunction,
  ContractInterface,
  ethers,
  Signer,
} from 'ethers';
import { promiseObject } from '@shared/helpers';
import { Provider } from '@ethersproject/providers';

type MultiChainConfig = {
  [chainId: string | number]: {
    provider?: Provider;
    address?: string;
  };
};

type ContractFunctions<C extends Contract = Contract> = {
  [K in keyof C]: C[K] extends ContractFunction ? C[K] : never;
};

type MultiChainReturnValue<C extends Contract> = C & {
  withMultiChain: ContractFunctions<C>;
};

export class MultiChainContractWrapper extends ContractWrapper<{
  withMultiChain: any;
}> {
  constructor(public config: MultiChainConfig) {
    super();
  }

  // @ts-ignore
  public create<C extends Contract>(
    address: string,
    abi: ContractInterface,
    signerOrProvider?: Signer | Provider,
  ): MultiChainReturnValue<C> {
    const contract = typesafeContract<C>(address, abi, signerOrProvider);
    return this.wrap(contract);
  }

  public wrap<C extends Contract>(contract: C): MultiChainReturnValue<C> {
    return new MultichainContract(
      contract,
      this.config,
    ) as unknown as MultiChainReturnValue<C>;
  }
}

class MultichainContract<T extends Contract> extends Contract {
  public withMultiChain = {} as ContractFunctions<T>;
  private _multichainConfig = {} as MultiChainConfig;

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

  constructor(contract: T, config: MultiChainConfig) {
    super(
      contract.address,
      contract.interface,
      contract.signer ?? contract.provider,
    );

    this._multichainConfig = config;

    Object.entries(this).forEach(([key, value]) => {
      if (!this.isContractFunction(key, value)) return;

      // Here we just replace each contract call with a set of ethers calls
      // to each network
      const self = this;

      // @ts-ignore
      this.withMultiChain[key] = async function (args: any[]): Promise<any> {
        const calls = Object.entries(self._multichainConfig).reduce(
          (obj, [chainId, config]) => {
            const contract = new ethers.Contract(
              config.address ?? self.address,
              self.interface,
              config.provider ?? self.provider,
            );
            return { ...obj, [chainId]: <T>contract[key](args) };
          },
          {},
        );

        return await promiseObject({
          ...calls,
          original: value(args),
        });
      };
    });
  }
}
