import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "ether-swr";
import { useState } from "react";
import { useUserBalances } from "./useBalances";
import { useOnChainVaultData } from "./useVaultDetails"

const useBlock = (): number => {
  const { library } = useWeb3React<Web3Provider>();
  const [block, setBlock] = useState(0)
  library && library.on('block', newblock => {
    setBlock(newblock)
  })
  return block
}

export const useOnChainData = (): boolean => {
  /**
   * Top down state initialisation, can hook up to a useLatestBlockNumber
   * to keep the state updated
   */
  const block = useBlock();
  const { loading: vaultsLoading } = useOnChainVaultData(block)
  const { loading: balancesLoading } = useUserBalances(vaultsLoading, block);
  return vaultsLoading || balancesLoading;
} 