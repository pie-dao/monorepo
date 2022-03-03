import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useMemo } from "react";
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers";
import { providers } from "@0xsequence/multicall";
import { Erc20 } from "../types/artifacts/abi/Erc20";
import ERC20ABI from "../abi/erc20.json";
import MonoABI from "../abi/mono.json";
import MerkleAuthABI from "../abi/MerkleAuth.json";
import VaultABI from "../abi/Vault.json";
import { MerkleAuth, Mono } from "../types/artifacts/abi";
import { ProviderNotActivatedError } from "../errors";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useWeb3Cache } from "./useCachedWeb3";
import { Vault } from "../types/artifacts/abi/Vault";
import {
  useMerkleAuthAddresses,
  useTokenAddresses,
  useVaultAddresses,
  useVaultCapAddresses,
} from "./useAddresses";

function getMulticallProvider(library: Web3Provider): MulticallProvider {
  /**
   * @dev ensure this is creating a multicall series of requests
   */
  return new providers.MulticallProvider(library, {
    // ftm
    contract: "0x6c31De530342b4F6681B2fE7c420248b920A63A2",
  });
}

function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(
  library: Web3Provider,
  account?: string | null,
  preferMulticall?: boolean
): MulticallProvider | JsonRpcSigner {
  /**
   * We currently batch multiple reads through multicall contract
   * But may need to pass write data individually
   */
  return !preferMulticall && account
    ? getSigner(library, account)
    : getMulticallProvider(library);
}

export function useContract<T extends Contract>(
  address?: string,
  ABI?: any
): T | undefined {
  const { chainId } = useWeb3Cache();
  const { library, account, active } = useWeb3React<Web3Provider>();

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) return;
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return new Contract(address, ABI, providerSigner);
    } catch (error) {
      console.error("Failed to get contract", error);
      return undefined;
    }
  }, [address, ABI, library, chainId, account, active]) as T;
}

export function useTokenContract(tokenAddress?: string) {
  return useContract<Erc20>(tokenAddress, ERC20ABI);
}

export function useMonoVaultContract(vaultAddress?: string) {
  return useContract<Mono>(vaultAddress, MonoABI);
}

export function useMerkleAuthContract(vaultAddress?: string) {
  return useContract<MerkleAuth>(vaultAddress, MerkleAuthABI);
}

export function useVaultCapContract(vaultAddress?: string) {
  return useContract<Vault>(vaultAddress, VaultABI);
}

export function useMultipleTokenContract(
  tokenAddresses?: string[],
  preferMulticall?: boolean,
  chainId?: number
): Erc20[] {
  return useMultipleContracts<Erc20>(
    tokenAddresses,
    ERC20ABI,
    preferMulticall,
    chainId
  ) as Erc20[];
}

export function useMultipleMonoContract(
  vaultAddresses?: string[],
  preferMulticall?: boolean,
  chainId?: number
): Mono[] {
  return useMultipleContracts<Mono>(
    vaultAddresses,
    VaultABI,
    preferMulticall,
    chainId
  ) as Mono[];
}

export function useMultipleMerkleAuthContract(
  authAddress?: string[],
  preferMulticall?: boolean,
  chainId?: number
): MerkleAuth[] {
  return useMultipleContracts<MerkleAuth>(
    authAddress,
    MerkleAuthABI,
    preferMulticall,
    chainId
  ) as MerkleAuth[];
}

export function useMultipleCapContract(
  capAddresses?: string[],
  preferMulticall?: boolean,
  chainId?: number
): Vault[] {
  return useMultipleContracts<Vault>(
    capAddresses,
    VaultABI,
    preferMulticall,
    chainId
  ) as Vault[];
}

export function useMultipleContracts<T extends Contract>(
  addresses?: string[],
  ABI?: any,
  preferMulticall?: boolean,
  chainId?: number
) {
  const context = useWeb3React();
  return useMemo(() => {
    if (!addresses || !ABI || !context.library || !chainId) return [];
    return addresses.map((a) => getContract(context, a, ABI, preferMulticall));
  }, [addresses, ABI, preferMulticall, context, chainId]) as T[];
}

const getContract = (
  context: Web3ReactContextInterface,
  address: string,
  ABI: any,
  preferMulticall?: boolean
) => {
  const { library, account, active } = context;
  try {
    if (!active) throw new ProviderNotActivatedError();
    const providerSigner = getProviderOrSigner(
      library,
      account,
      preferMulticall
    );
    return new Contract(address, ABI, providerSigner);
  } catch (error) {
    console.error("Failed to get contract", error, address, ABI);
    return undefined;
  }
};

export const useContracts = (chainId?: number) => {
  const tokenAddresses = useTokenAddresses();
  const monoAddresses = useVaultAddresses();
  const authAddresses = useMerkleAuthAddresses();
  const capAddresses = useVaultCapAddresses();
  const monoContracts = useMultipleMonoContract(monoAddresses, true, chainId);
  const authContracts = useMultipleMerkleAuthContract(
    authAddresses,
    true,
    chainId
  );
  const tokenContracts = useMultipleTokenContract(
    tokenAddresses,
    true,
    chainId
  );
  const capContracts = useMultipleCapContract(capAddresses, true, chainId);
  return {
    monoContracts,
    tokenContracts,
    authContracts,
    capContracts,
  };
};
