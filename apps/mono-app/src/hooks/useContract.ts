import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { useMemo } from "react"
import { MulticallProvider } from "@0xsequence/multicall/dist/declarations/src/providers"
import { providers } from "@0xsequence/multicall"
import { Erc20 } from "../types/abi/Erc20"
import ERC20ABI from '../abi/erc20.json'
import { Mono } from "../types/abi"
import MonoABI from '../abi/mono.json'
import { ProviderNotActivatedError } from "../errors"

function getMulticallProvider(library: Web3Provider): MulticallProvider {
  /**
   * @dev ensure this is creating a multicall series of requests
   */
  return new providers.MulticallProvider(library);
}

function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

function getProviderOrSigner(library: Web3Provider, account?: string | null): MulticallProvider | JsonRpcSigner {
  /**
   * We currently batch multiple reads through multicall contract
   * But may need to pass write data individually
   */
  return account
    ? getSigner(library, account)
    : getMulticallProvider(library)
}

export function useContract<T extends Contract>(
  address: string,
  ABI: any,
): T | undefined {

  const { library, account, chainId, active } = useWeb3React<Web3Provider>()

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) return undefined
    try {
      if (!active) throw new ProviderNotActivatedError();
      const providerSigner = getProviderOrSigner(library, account);
      return new Contract(address, ABI, providerSigner);
    } catch (error) {
      console.error('Failed to get contract', error)
      return undefined
    }
  }, [address, ABI, library, chainId]) as T
}

export function useTokenContract(tokenAddress: string) {
  return useContract<Erc20>(tokenAddress, ERC20ABI);
}

export function useMonoVaultContract(vaultAddress: string) {
  return useContract<Mono>(vaultAddress, MonoABI);
}