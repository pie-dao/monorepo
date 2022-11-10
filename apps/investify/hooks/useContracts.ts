import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from '@0xsequence/multicall';
import { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { LibraryProvider } from '../types/utilities';
import { JsonRpcSigner } from '@ethersproject/providers';
import { ProviderNotActivatedError } from '../errors';
import {
  Erc20Abi__factory,
  YieldvaultAbi__factory,
  MerkleauthAbi__factory,
  TokenlockerAbi__factory,
} from '@shared/util-blockchain';
import tokensConfig from '../config/products.json';

function getSigner(library: LibraryProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

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

export function useVaultContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return YieldvaultAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useERC20Contract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return Erc20Abi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useAuthContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return MerkleauthAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useStakingContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return TokenlockerAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useAuxoVaultContract(vaultAddress?: string) {
  return useVaultContract(vaultAddress);
}

export function useTokenContract(tokenAddress?: string) {
  return useERC20Contract(tokenAddress);
}

export function useMerkleAuthContract(vaultAddress?: string) {
  return useAuthContract(vaultAddress);
}

export function useStakingTokenContract(token?: string) {
  const { chainId } = useWeb3React();
  return useStakingContract(
    tokensConfig[token]?.addresses[chainId]?.stakingContract,
  );
}
