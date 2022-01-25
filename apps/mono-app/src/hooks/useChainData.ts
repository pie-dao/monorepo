import { useUserBalances } from "./useBalances";
import { useOnChainVaultData } from "./useVaultDetails"

export const useOnChainData = (): boolean => {
  /**
   * Top down state initialisation, can hook up to a useLatestBlockNumber
   * to keep the state updated
   */
  const { loading: vaultsLoading } = useOnChainVaultData()
  const { loading: balancesLoading } = useUserBalances(vaultsLoading);
  return vaultsLoading || balancesLoading;
} 