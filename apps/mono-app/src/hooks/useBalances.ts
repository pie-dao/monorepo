import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { Erc20, Mono } from "../types/artifacts/abi";
import {  useMultipleMonoContract, useMultipleTokenContract } from "./useContract";
import { UserBalanceOnChainData, UserBalances, Vault } from "../store/vault/Vault";
import { AwaitedReturn, toBalance } from "../utils";
import { useAddresses } from "./useAddresses";
import { setUserBalances } from "../store/vault/vault.slice";

const getUserBalances = async (
  token: Erc20,
  vault: Mono,
  account: string,
  decimals: number,
) => {
  return await Promise.all([
    vault.address,
    token.balanceOf(account),
    vault.balanceOf(account),
    vault.balanceOfUnderlying(account),
    token.allowance(account, vault.address),
    decimals
  ])
}

const toUserBalances = (
  userBalancedata: AwaitedReturn<typeof getUserBalances>,
): UserBalanceOnChainData => {
  const decimals = userBalancedata[5];
  return {
    address: userBalancedata[0],
    userBalances: {
      wallet: toBalance(userBalancedata[1], decimals),
      vault: toBalance(userBalancedata[2], decimals),
      vaultUnderlying: toBalance(userBalancedata[3], decimals),
      allowance: toBalance(userBalancedata[4], decimals)
    }
  }
}

const useTokenAddresses = () => {
  return useAppSelector(state => state.vault.vaults
    .map(v => v.token?.address)
    .filter(v => !!v)
  ) as string[] | undefined
}

export const useUserBalances = (vaultDataLoaded: boolean, block: number): { loading: boolean }  => {
  /**
    * Grab the user balances for each ERC20 token
    * In terms of:
    *  -- ERC20 in the wallet
    *  -- ERC20 in the vault
    *  -- Vault tokens
    */
  const [loading, setLoading] = useState(false);
  const { account, active, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const tokenAddresses = useTokenAddresses()
  const monoAddresses = useAddresses();
  const vaults = useAppSelector(state => state.vault.vaults)
  const monoContracts = useMultipleMonoContract(monoAddresses, true)
  const tokenContracts = useMultipleTokenContract(tokenAddresses, true)

  useEffect(() => {
    if (block && account && active && tokenContracts.length > 0 && monoContracts.length > 0) {
      setLoading(true);
      // Multicall contract executes promise all as a batch request
      Promise.all(
        tokenContracts.map(async token => {
          const vault = vaults.find(async v => v.token?.address === token.address);
          const mono = monoContracts.find(m => m.address === vault?.address);
          if (mono && vault && vault.token) {
            return await getUserBalances(token, mono, account, vault.token.decimals);
          }
        })
      ).then(payload => {
        payload.filter(p => !!p).forEach(p => {
          const data = p && toUserBalances(p);
          if (data) {
            dispatch(setUserBalances(data));
          }
        })
        setLoading(false)
        })
      }
  }, [account, active, chainId, vaultDataLoaded])
  return { loading }
};
