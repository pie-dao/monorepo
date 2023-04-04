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
  TokenLockerAbi__factory,
  StakingManagerAbi__factory,
  PRVAbi__factory,
  UpgradoorAbi__factory,
  AUXOAbi__factory,
  SharesTimeLockAbi__factory,
  RollStakerAbi__factory,
  MerkleDistributorAbi__factory,
  ClaimHelperAbi__factory,
  PRVMerkleVerifierAbi__factory,
} from '@shared/util-blockchain';
import tokensConfig from '../config/products.json';
import migration from '../config/migration.json';

export function getSigner(
  library: LibraryProvider,
  account: string,
): JsonRpcSigner {
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

export function useAUXOContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return AUXOAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [library, active, account, address]);
}

export function useXAUXOContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return PRVAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useRollStakerContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return RollStakerAbi__factory.connect(address, providerSigner);
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
      return TokenLockerAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useUpgradoorContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return UpgradoorAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useStakingManager(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return StakingManagerAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useVeDOUGHSharesTimeLockContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return SharesTimeLockAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useMerkleDistributorContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return MerkleDistributorAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function useClaimHelperContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return ClaimHelperAbi__factory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [address, library, account, active]);
}

export function usePRVMerkleVerifierContract(address?: string) {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return PRVMerkleVerifierAbi__factory.connect(address, providerSigner);
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
    tokensConfig[token]?.addresses[chainId]?.stakingAddress,
  );
}

export function useVeDOUGHStakingContract() {
  const { chainId } = useWeb3React();
  return useVeDOUGHSharesTimeLockContract(
    migration['veDOUGH']?.addresses?.[chainId]?.stakingAddress,
  );
}

export function useAUXOTokenContract() {
  const { chainId } = useWeb3React();
  return useAUXOContract(tokensConfig['AUXO']?.addresses[chainId]?.address);
}

export function useXAUXOTokenContract() {
  const { chainId } = useWeb3React();
  return useXAUXOContract(tokensConfig['PRV']?.addresses[chainId]?.address);
}

export function useRollStakerXAUXOContract() {
  const { chainId } = useWeb3React();
  return useRollStakerContract(
    tokensConfig['PRV']?.addresses[chainId]?.rollStakerAddress,
  );
}

export function useUpgradoor() {
  const { chainId } = useWeb3React();
  return useUpgradoorContract(
    migration['veDOUGH']?.addresses?.[chainId]?.upgradoorAddress,
  );
}

export function useXAUXOStakingManager() {
  const { chainId } = useWeb3React();
  return useStakingManager(
    tokensConfig['PRV']?.addresses[chainId]?.stakingAddress,
  );
}

export function useMerkleDistributor(token: string) {
  const { chainId } = useWeb3React();
  return useMerkleDistributorContract(
    tokensConfig[token]?.addresses[chainId]?.merkleDistributorAddress,
  );
}

export function useClaimHelper(token: string) {
  const { chainId } = useWeb3React();
  return useClaimHelperContract(
    tokensConfig[token]?.addresses[chainId]?.merkleDistributorHelperAddress,
  );
}

export function usePRVMerkleVerifier() {
  const { chainId } = useWeb3React();
  return usePRVMerkleVerifierContract(
    tokensConfig['PRV']?.addresses?.[chainId]?.PRVMerkleVerifierAddress,
  );
}
