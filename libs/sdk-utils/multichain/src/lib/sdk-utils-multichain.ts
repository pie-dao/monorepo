import { Provider } from '@ethersproject/providers';
import { ContractWrapper, decorate } from '@sdk-utils/core';
import { smartPool, SmartpoolAbi__factory } from '@shared/util-blockchain';
import { Contract } from 'ethers';

interface MultichainResponse {
  meta: MultichainMeta;
  responses: MultichainResponseData[];
}

interface MultichainMeta {
  chainIds: number;
  ok: number;
  err: number;
}
interface MultichainResponseData {
  chainId: number;
  response: any;
}

type MultichainContract = {
  multichain: {
    enabled: boolean;
    chainIds: number[];
  };
  withMultichain(): MultichainResponse;
};

type ChainsOrProviders = number[] | Record<number, Provider>[];
export class MultiChainWrapper extends ContractWrapper<MultichainContract> {
  public chains: number[];
  // constructor(chains: ChainsOrProviders) {
  constructor(chains: number[]) {
    super();
    this.chains = chains;
  }

  public wrap<C extends Contract>(contract: C): C & MultichainContract {
    const dummy = {} as MultichainResponse;
    return decorate(contract, {
      multichain: {
        enabled: true,
        chainIds: this.chains,
      },
      withMultichain: () => dummy,
    });
  }
}
