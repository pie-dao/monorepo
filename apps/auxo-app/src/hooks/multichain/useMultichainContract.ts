import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcSigner } from '@ethersproject/providers';
import { useMemo } from 'react';
import { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { providers } from '@0xsequence/multicall';
import { Erc20 } from '../../types/artifacts/abi/Erc20';
import ERC20ABI from '../../abi/erc20.json';
import MerkleAuthABI from '../../abi/MerkleAuth.json';
import AuxoABI from '../../abi/Vault.json';
import { MerkleAuth, Vault as Auxo } from '../../types/artifacts/abi';
import { useWeb3Cache } from '../useCachedWeb3';
import { LibraryProvider } from '../../types/utilities';
import { useMultipleProvider } from './useMultipleWeb3Provider';
import { useProxySelector } from '../../store';
import { ProviderNotActivatedError } from '../../errors';

function getMulticallProvider(
  provider: LibraryProvider,
  multicallContract?: string | null,
): MulticallProvider {
  /**
   * Route multicalls through the deployed multicall contract, if provided
   * Each network may have a different multicall address.
   * See https://www.npmjs.com/package/@0xsequence/multicall for details
   */
  if (!multicallContract) return new providers.MulticallProvider(provider);
  return new providers.MulticallProvider(provider, {
    contract: multicallContract,
  });
}

function getSigner(library: LibraryProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(
  provider: LibraryProvider,
  account?: string | null,
  multicallAddress?: string | null,
): MulticallProvider | JsonRpcSigner {
  /**
   * If passing the account details, we will return the signer
   */
  return !multicallAddress && account
    ? getSigner(provider, account)
    : getMulticallProvider(provider, multicallAddress);
}

const getContract = <T extends Contract>({
  provider,
  address,
  ABI,
  account,
  multicallAddress,
}: {
  provider: LibraryProvider;
  address: string;
  ABI: any;
  account?: string | null;
  multicallAddress?: string | null;
}): T | undefined => {
  try {
    const providerSigner = getProviderOrSigner(
      provider,
      account,
      multicallAddress,
    );
    return new Contract(address, ABI, providerSigner) as T;
  } catch (error) {
    console.error('Failed to get contract', error, address, ABI);
  }
};

/**
 * Using individual contracts is primarily for interacting with single vaults as a signer.
 * We pass the account if we have it, which gets a signer instead of the multicall provider.
 */
export function useContract<T extends Contract>(address?: string, ABI?: any) {
  const { library, account, active } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return new Contract(address, ABI, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, ABI, library, account, active]) as T;
}

export function useTokenContract(tokenAddress?: string) {
  return useContract<Erc20>(tokenAddress, ERC20ABI);
}

export function useAuxoVaultContract(vaultAddress?: string) {
  return useContract<Auxo>(vaultAddress, AuxoABI);
}

export function useMerkleAuthContract(vaultAddress?: string) {
  return useContract<MerkleAuth>(vaultAddress, MerkleAuthABI);
}

/**
 * In the case of multiple networks, prefer to use the web3react provider
 * which will be connected to the currently active chain ids. If the chain id of the vault
 * does not match the current chain id, then get one of the other providers to handle the RPC calls.
 */
type MultipleMulticallContractArgs = {
  address: string;
  multicallAddress: string | null;
  chainId: number;
  ABI: any;
};
export const useMultipleContracts = <T extends Contract>(
  contractArgs: MultipleMulticallContractArgs[],
) => {
  const { account, library } = useWeb3React();
  const { chainId: currentChainId } = useWeb3Cache();
  const { getProviderForNetwork } = useMultipleProvider();

  return useMemo(() => {
    if (!currentChainId || !library) return;

    return contractArgs.map((args) => {
      // default to using the library provider
      let provider: LibraryProvider = library;

      if (currentChainId !== args.chainId) {
        // we need to use a backup provider
        provider = getProviderForNetwork(args.chainId);
      }

      const { address, ABI, multicallAddress } = args;
      return getContract<T>({
        provider,
        address,
        account,
        ABI,
        multicallAddress,
      });
    });
  }, [contractArgs, getProviderForNetwork, currentChainId, account, library]);
};

/**
 * Functions below are utility wrappers to encapsulate
 * fetching all vaults and contracts as a single hook
 */

export function useMultipleMerkleAuthContract(
  args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>,
): MerkleAuth[] {
  const merkleAuthArgs: MultipleMulticallContractArgs[] = args.map((a) => ({
    ...a,
    ABI: MerkleAuthABI,
  }));
  return useMultipleContracts(merkleAuthArgs) as MerkleAuth[];
}

export function useMultipleAuxoContract(
  args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>,
): Auxo[] {
  const auxoArgs: MultipleMulticallContractArgs[] = args.map((a) => ({
    ...a,
    ABI: AuxoABI,
  }));
  return useMultipleContracts(auxoArgs) as Auxo[];
}

export function useMultipleErc20Contract(
  args: Array<Omit<MultipleMulticallContractArgs, 'ABI'>>,
): Erc20[] {
  const erc20Args: MultipleMulticallContractArgs[] = args.map((a) => ({
    ...a,
    ABI: ERC20ABI,
  }));
  return useMultipleContracts(erc20Args) as Erc20[];
}

/**
 * proxy selector is used to control re-renders when the vaults array changes, but the relevant data does not.
 */

const useAuxoParams = (): Array<Omit<MultipleMulticallContractArgs, 'ABI'>> => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => ({
      address: v.address,
      chainId: v.network.chainId,
      multicallAddress: v.network.multicall,
    })),
  );
};

const useTokenParams = (): Array<
  Omit<MultipleMulticallContractArgs, 'ABI'>
> => {
  const args = useProxySelector((state) =>
    state.vault.vaults.map((v) => ({
      address: v.token.address,
      chainId: v.network.chainId,
      multicallAddress: v.network.multicall,
    })),
  );
  return args;
};

const useAuthParams = (): Array<Omit<MultipleMulticallContractArgs, 'ABI'>> => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => ({
      address: v.auth.address,
      chainId: v.network.chainId,
      multicallAddress: v.network.multicall,
    })),
  );
};

export const useContracts = () => {
  const auxoParams = useAuxoParams();
  const tokenParams = useTokenParams();
  const authParams = useAuthParams();

  const tokenContracts = useMultipleErc20Contract(tokenParams);
  const auxoContracts = useMultipleAuxoContract(auxoParams);
  const authContracts = useMultipleMerkleAuthContract(authParams);
  return {
    auxoContracts,
    authContracts,
    tokenContracts,
  };
};
