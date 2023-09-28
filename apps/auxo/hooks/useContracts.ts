import { useMemo } from 'react';
import { providers } from '@0xsequence/multicall';
import { MulticallProvider } from '@0xsequence/multicall/dist/declarations/src/providers';
import { LibraryProvider } from '../types/utilities';
import { JsonRpcSigner, Provider } from '@ethersproject/providers';
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
import { Signer, ethers } from 'ethers';
import { useSetChain } from '@web3-onboard/react';
import { useConnectWallet } from '@web3-onboard/react';
import { EIP1193Provider } from '@web3-onboard/core';
import { MAINNET_RPC } from '../utils/networks';

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
  account?: EIP1193Provider,
  multicallAddress?: string | null,
): MulticallProvider | JsonRpcSigner {
  /**
   * If passing the account details, we will return the signer
   */
  return !multicallAddress && account
    ? new ethers.providers.Web3Provider(account).getSigner()
    : getMulticallProvider(provider, multicallAddress);
}

interface ContractFactory {
  connect(address: string, providerSigner: Provider | Signer): unknown;
}

export function useContract<T extends ContractFactory>(
  abiFactory: T,
  address: string,
): ReturnType<T['connect']> | undefined {
  const [{ wallet }] = useConnectWallet();
  const walletProvider = wallet?.provider;
  return useMemo(() => {
    if (!address) return;
    try {
      const provider = getProviderOrSigner(
        new ethers.providers.JsonRpcProvider(MAINNET_RPC),
        walletProvider,
      );
      return abiFactory.connect(address, provider);
    } catch (error) {
      console.error('Failed to get contract', error);
      return undefined;
    }
  }, [walletProvider, abiFactory, address]);
}

export function useTokenContract(tokenAddress?: string) {
  return useContract(Erc20Abi__factory, tokenAddress);
}

export function useStakingTokenContract(token?: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    TokenLockerAbi__factory,
    tokensConfig?.[token]?.addresses?.[chainId]?.stakingAddress,
  );
}

export function useVeDOUGHStakingContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    SharesTimeLockAbi__factory,
    migration?.['veDOUGH']?.addresses?.[chainId]?.stakingAddress,
  );
}

export function useAUXOTokenContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    AUXOAbi__factory,
    tokensConfig?.['AUXO']?.addresses[chainId]?.address,
  );
}

export function useXAUXOTokenContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    PRVAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.address,
  );
}

export function usePRVRouterContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    PRVRouterAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.PRVRouterAddress,
  );
}

export function useRollStakerXAUXOContract() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    RollStakerAbi__factory,
    tokensConfig?.['PRV']?.addresses[chainId]?.rollStakerAddress,
  );
}

export function useUpgradoor() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    UpgradoorAbi__factory,
    migration?.['veDOUGH']?.addresses?.[chainId]?.upgradoorAddress,
  );
}

export function useMerkleDistributor(token: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    MerkleDistributorAbi__factory,
    tokensConfig?.[token]?.addresses[chainId]?.merkleDistributorAddress,
  );
}

export function useClaimHelper(token: string) {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    ClaimHelperAbi__factory,
    tokensConfig?.[token]?.addresses[chainId]?.merkleDistributorHelperAddress,
  );
}

export function usePRVMerkleVerifier() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    PRVMerkleVerifierAbi__factory,
    tokensConfig?.['PRV']?.addresses?.[chainId]?.PRVMerkleVerifierAddress,
  );
}

export function useARVToken() {
  const [{ connectedChain }] = useSetChain();
  const chainId = connectedChain?.id ? Number(connectedChain.id) : null;
  return useContract(
    VeAUXOAbi__factory,
    tokensConfig?.['ARV']?.addresses?.[chainId]?.address,
  );
}
