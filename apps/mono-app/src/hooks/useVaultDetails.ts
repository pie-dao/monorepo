import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useAppDispatch } from ".";
import { VaultOnChainData, VaultStats, VaultToken } from "../store/vault/Vault";
import { getVaultDetails } from "../store/vault/vault.actions.";
import { setOnChainVaultData } from "../store/vault/vault.slice";
import { AwaitedReturn, fromScale } from "../utils";
import { useAddresses } from "./useAddresses";
import { useMultipleMonoContract } from "./useContract";

const toVaultToken = (
  vaultDetails: AwaitedReturn<typeof getVaultDetails>,
): VaultToken => ({
  address: vaultDetails[1],
  decimals: vaultDetails[2]
})

const toVaultStats = (
  vaultDetails: AwaitedReturn<typeof getVaultDetails>,
  decimals: number
): VaultStats => ({
  deposits: {
    label: fromScale(vaultDetails[3], decimals),
    value: vaultDetails[3].toString()
  },
  lastHarvest: vaultDetails[4].toNumber(),
  currentAPY: vaultDetails[5].toNumber(),
})

const toOnChainVaultData = (
  vaultDetails: AwaitedReturn<typeof getVaultDetails>
): VaultOnChainData => {
  const token = toVaultToken(vaultDetails)
  return {
    address: vaultDetails[0],
    token,
    stats: toVaultStats(vaultDetails, token.decimals)
  }
}

/**
 * Get the application level vault details routing through the multicall contract
 */
export const useOnChainVaultData = (block: number): {
  loading: boolean;
} => {
  const dispatch = useAppDispatch()
  const { account, active, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const vaultAddresses = useAddresses()
  const monoContracts = useMultipleMonoContract(vaultAddresses, true)
  // batch request onChain data from each vault
  useEffect(() => {
    if (account && active && monoContracts.length > 0) {
      setLoading(true)
      // Multicall contract executes promise all as a batch request
      Promise.all(
        monoContracts.map(async v => await getVaultDetails(v))
      ).then(payload => {
        payload.forEach(p => {
          const data = toOnChainVaultData(p) 
          dispatch(setOnChainVaultData(data))
        })
        setLoading(false)
      })
    }
  }, [account, active, chainId, block])
  return {
    loading,
  }
}




