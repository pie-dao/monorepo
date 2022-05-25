import {
  BlockTag,
  getNetwork,
  Provider,
  TransactionRequest,
} from '@ethersproject/providers';
import { ContractWrapper, decorate, typesafeContract } from '@sdk-utils/core';
import {
  smartPool,
  SmartpoolAbi,
  SmartpoolAbi__factory,
} from '@shared/util-blockchain';
import { Contract, ContractFunction, ethers, Transaction } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';

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

type ChainsOrProviders = number[] | ChainProviderOption[];

interface ChainProviderOption {
  [x: number]: {
    provider?: Provider;
    options?: {
      onErr?: 'silent' | 'warn' | 'throw';
      timeout?: number;
    };
  };
}

class MultiChainInstantiator {
  public providers: ChainProviderOption = {};
  public crossChainContracts: Contract[] = [];

  constructor(public chains: ChainsOrProviders) {}

  private setProviders() {
    if (typeof this.chains[0] === 'number') {
      const providers: ChainProviderOption = (this.chains as number[]).reduce(
        (obj, chain) => {
          return {
            ...obj,
            [chain]: ethers.getDefaultProvider(getNetwork(chain)),
          };
        },
        {},
      );
      this.providers = providers;
    }
  }

  public stageMultichain(overrides?: MultichainCallOptions) {
    return <T>(call: ContractFunction<T>, options?: MultichainCallOptions) => {
      const contract = typesafeContract<SmartpoolAbi>('', '');
      const balanceCall = () => contract.balanceOf('');

      this.chains.forEach((chain) => {
        if (typeof chain !== 'number') return;

        // connect to the new provider
        const connected = contract.connect(this.providers[chain].provider!);

        const newContract = typesafeContract<typeof contract>(
          contract.address,
          contract.interface,
          this.providers[chain].provider!,
        );

        this.crossChainContracts.push(newContract);
      });
    };
  }

  /**
   * Ideally I'd intercept the call if primed with execute multichain
   */
  public executeMultichain() {
    const tsc = typesafeContract<SmartpoolAbi>('', '');
    const balanceCall = () => tsc.balanceOf('');

    const results = this.crossChainContracts.map((contract) => {
      const toBeCalled = tsc.balanceOf;
    });

    return this;
  }
}

interface MultichainCallOptions {
  overrides?: ChainProviderOption & {
    address?: string;
  };
}

async function callMultiChain<T>(
  call: ContractFunction<T>,
  options?: MultichainCallOptions,
): ReturnType<ContractFunction<T>> {
  return await call();
}

export class MultichainProvider extends ethers.providers.JsonRpcProvider {
  public chainData: MultichainResponse | {} = {};

  constructor(public provider: ethers.providers.Provider) {
    super();
  }

  async call(
    t: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>,
    address?: string,
  ): Promise<string> {
    const original = super.call(t, blockTag);
    const chainId = (await this.getNetwork()).chainId;

    this.chainData = {
      meta: {
        chainIds: [chainId],
        err: 0,
        ok: 1,
      },
      responses: [{ chainId, response: original }],
    };

    console.debug(this.chainData);

    console.debug({ t, original: await original });

    return original;
  }
}
