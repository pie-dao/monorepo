import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "ether-swr";
import { useState } from "react";
import { useUserBalances } from "./useBalances";
import { useBlock } from "./useBlock";
import { useWeb3Cache } from "./useCachedWeb3";
import { useOnChainVaultData } from "./useVaultDetails"


export const useOnChainData = (): boolean => {
  /**
   * Top down state initialisation, can hook up to a useLatestBlockNumber
   * to keep the state updated
   */
  // chain ID requires a call to the node, need to be careful with rerenders
  const { chainId } = useWeb3Cache();
  const { loading: vaultsLoading } = useOnChainVaultData({ chainId })
  const { loading: balancesLoading } = useUserBalances(vaultsLoading, chainId);
  return vaultsLoading || balancesLoading;
} 