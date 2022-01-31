import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useAppDispatch } from ".";
import { getErrorMessage } from "../errors";
import { setError } from "../store/app/app.slice";
import { VaultOnChainData, VaultStats, VaultToken } from "../store/vault/Vault";
import { setOnChainVaultData } from "../store/vault/vault.slice";
import { Mono } from "../types/artifacts/abi";
import { AwaitedReturn, fromScale } from "../utils";
import { chainMap } from "../utils/networks";
import { useAddresses } from "./useAddresses";
import { useBlock } from "./useBlock";
import { useWeb3Cache } from "./useCachedWeb3";
import { useMultipleMonoContract } from "./useContract";

export const getVaultDetails = async (vault: Mono) => {
  return await Promise.all(
    [
      vault.address,
      // token address
      vault.underlying(),
      vault.underlyingDecimals(),
      vault.totalUnderlying(),
      vault.lastHarvest(),
      vault.estimatedReturn(),
      vault.batchBurnRound(),
    ]
  )
}

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
  batchBurnRound: vaultDetails[6].toNumber()
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
export const useOnChainVaultData = ({ chainId }: { chainId?: number }): {
  loading: boolean;
} => {
  const { blockNumber } = useBlock();
  // const { chainId } = useWeb3Cache();
  const dispatch = useAppDispatch()
  const { account, active } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const vaultAddresses = useAddresses()
  const monoContracts = useMultipleMonoContract(vaultAddresses, true, chainId);

  // batch request onChain data from each vault
  useEffect(() => {
    if (
      active &&
      monoContracts.length > 0 
      &&
      chainId &&
      chainMap[chainId]
      ) {
      console.debug('called onChain');
      setLoading(true)
      // Multicall contract executes promise all as a batch request
      Promise.all(
        monoContracts.map(async v => await getVaultDetails(v))
          // []
        ).then(payload => {
        payload.forEach(p => {
          const data = toOnChainVaultData(p) 
          dispatch(setOnChainVaultData(data))
        })
        setLoading(false)
      })
      .catch(err => {
        dispatch(setError(getErrorMessage(err)))
      })
    }
  }, [blockNumber, account, active])
  return {
    loading,
  }
}




