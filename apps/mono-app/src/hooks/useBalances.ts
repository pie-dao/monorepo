import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState, useMemo, useEffect } from "react";
import { useActiveWeb3 } from './useWeb3';
import { getNameOfDeclaration } from "typescript";
import { useAppDispatch, useAppSelector } from ".";
import { setStats, Vault } from "../store/vault/vaultSlice";
import { Mono } from "../types/artifacts/abi";
import { useMonoVaultContract, useMultipleContracts, useMultipleMonoContract, useMultipleTokenContract, useTokenContract } from "./useContract";
import { injected } from "../connectors";

const selectAddresses = (vaults: Vault[], contract: keyof Vault['addresses']) => vaults.map((v) => v.addresses[contract]);

// export const useMulticallUserBalances = () => {
//   /**
//    * Grab the user balances for each token across all vaults
//    */
//   const [loading, setLoading] = useState(false);
//   const { account } = useWeb3React();
//   const [balances, setBalances] = useState<Array<BigNumber| undefined>>([]);
//   const tokens = useAppSelector((state) => selectAddresses(state.vault.vaults, 'token'));
//   if (account) {
//     setLoading(true);  
//     Promise.all(
//       tokens.map((t) => {
//         const tokenContract = useTokenContract(t);
//         return tokenContract?.balanceOf(account);
//       }),
//     ).then((b) => { 
//       setBalances(b);
//       setLoading(false)
//     });
//   }
//   return { balances, loading }
// };

const getVaultSupplyAndAddress = async (vault: Mono) => {
  return await Promise.all([
    vault.totalSupply(),
    vault.address
  ])
}

export const useMulticallVaultDeposits = () => {
  /**
   * @dev we can use the single call to the vault and batch these together
   */
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { account, active } = useActiveWeb3();
  const vaultAddresses = useAppSelector((state) => selectAddresses(
    state.vault.vaults, 'vault'
  ));
  const vaults = useAppSelector(state => state.vault.vaults)
  const monoContracts = useMultipleMonoContract(vaultAddresses)
  useEffect(() => {
    if (account && active && monoContracts.length > 0) {
      setLoading(true);
      Promise.all(
        monoContracts.map(async v => await getVaultStats(vaults, v))
      ).then(payload => {
        reduxSetStats(dispatch, payload)
        setLoading(false)
      })
    }
  }, [account, active])
  return { vaults, loading }
};

const reduxSetStats = (dispatch: ReturnType<typeof useAppDispatch>, payload: [string, BigNumber][]) => {
  payload.forEach(([name, supply]) => {
    const p = generatePayload(name, supply)
    dispatch(setStats(p))
  })
}

const getVaultStats = async (vaults: Vault[], v: Mono) => {
  const name = vaults.find(vault => vault.addresses.vault === v.address)!.name
  return [
    name,
    await v.totalSupply()
  ] as [string, BigNumber]
}

const generatePayload = (name: string, supply: BigNumber) => ({
  name,
  stats: {
    deposits: Number(supply.toBigInt() / 10n ** 18n),
    historicalAPY: 0,
    projectedAPY: 0
  }
})