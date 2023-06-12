import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from '@0xsequence/multicall';
import { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { LibraryProvider } from '../types/utilities';
import { JsonRpcSigner, Provider } from '@ethersproject/providers';
import { ProviderNotActivatedError } from '../errors';
import {
  Erc20Abi__factory,
  TokenLockerAbi__factory,
  PRVAbi__factory,
  UpgradoorAbi__factory,
  AUXOAbi__factory,
  SharesTimeLockAbi__factory,
  RollStakerAbi__factory,
  MerkleDistributorAbi__factory,
  ClaimHelperAbi__factory,
  PRVMerkleVerifierAbi__factory,
  PRVRouterAbi__factory,
  VeAUXOAbi__factory,
} from '@shared/util-blockchain';
import tokensConfig from '../config/products.json';
import migration from '../config/migration.json';
import { Signer } from 'ethers';
import { useSetChain } from '@web3-onboard/react';

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

interface ContractFactory {
  connect(address: string, providerSigner: Provider | Signer): any;
}

export function useContract<T extends ContractFactory>(
  abiFactory: T,
  address: string,
): ReturnType<T['connect']> | undefined {
  const { library, account, active } = useWeb3React();
  return useMemo(() => {
    if (!address || !library) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return abiFactory.connect(address, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [abiFactory, address, library, account, active]);
}

export function useTokenContract(tokenAddress?: string) {
  return useContract(Erc20Abi__factory, tokenAddress);
}

export function useStakingTokenContract(token?: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    TokenLockerAbi__factory,
    tokensConfig?.[token]?.addresses?.[chainId]?.stakingAddress,
  );
}

export function useVeDOUGHStakingContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    SharesTimeLockAbi__factory,
    migration?.['veDOUGH']?.addresses?.[chainId]?.stakingAddress,
  );
}

export function useAUXOTokenContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    AUXOAbi__factory,
    tokensConfig?.['AUXO']?.addresses[chainId]?.address,
  );
}

export function useXAUXOTokenContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    PRVAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.address,
  );
}

export function usePRVRouterContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    PRVRouterAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.PRVRouterAddress,
  );
}

export function useRollStakerXAUXOContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    RollStakerAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.rollStakerAddress,
  );
}

export function useUpgradoor() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    UpgradoorAbi__factory,
    migration?.['veDOUGH']?.addresses?.[chainId]?.upgradoorAddress,
  );
}

export function useMerkleDistributor(token: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    MerkleDistributorAbi__factory,
    tokensConfig?.[token]?.addresses[chainId]?.merkleDistributorAddress,
  );
}

export function useClaimHelper(token: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    ClaimHelperAbi__factory,
    tokensConfig?.[token]?.addresses[chainId]?.merkleDistributorHelperAddress,
  );
}

export function usePRVMerkleVerifier() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    PRVMerkleVerifierAbi__factory,
    tokensConfig?.['PRV']?.addresses?.[chainId]?.PRVMerkleVerifierAddress,
  );
}

export function useARVToken() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id;
  return useContract(
    VeAUXOAbi__factory,
    tokensConfig?.['ARV']?.addresses?.[chainId]?.address,
  );
}
