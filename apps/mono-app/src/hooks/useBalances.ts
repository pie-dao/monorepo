import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { Erc20, Mono } from "../types/artifacts/abi";
import {  useMultipleMonoContract, useMultipleTokenContract } from "./useContract";
import { Balance, UserBalanceOnChainData } from "../store/vault/Vault";
import { AwaitedReturn, toBalance } from "../utils";
import { useAddresses } from "./useAddresses";
import { setUserBalances } from "../store/vault/vault.slice";
import { BigNumber } from "@ethersproject/bignumber";
import { chainMap } from "../utils/networks";
import { useBlock } from "./useBlock";
import { useProxySelector } from "../store";

const getUserBalances = async (
  token: Erc20,
  vault: Mono,
  account: string,
  batchBurnRound: number,
) => {
  return await Promise.all([
    token.balanceOf(account),
    vault.balanceOf(account),
    vault.balanceOfUnderlying(account),
    token.allowance(account, vault.address),
    vault.userBatchBurnReceipts(account),
    vault.batchBurns(batchBurnRound)
  ])
}

const calculateAvailable = (shares: BigNumber, amountPerShare: BigNumber, decimals: number): Balance => {
  const bigAvailable = shares.mul(amountPerShare);
  return toBalance(bigAvailable, decimals);
}

const toUserBalances = ({address, decimals, userBalancedata }: {
  address: string,
  decimals: number,
  userBalancedata: AwaitedReturn<typeof getUserBalances>,
}): UserBalanceOnChainData => {
  const shares = userBalancedata[4][1];
  const amountPerShare = userBalancedata[5][1];
  return {
    address,
    userBalances: {
      wallet: toBalance(userBalancedata[0], decimals),
      vault: toBalance(userBalancedata[1], decimals),
      vaultUnderlying: toBalance(userBalancedata[2], decimals),
      allowance: toBalance(userBalancedata[3], decimals),
      batchBurn: {
        round: userBalancedata[4][0].toNumber(),
        shares: toBalance(shares, decimals),
        available: calculateAvailable(shares, amountPerShare, decimals)
      }
    }
  }
}

const useTokenAddresses = () => {
  return useProxySelector(state => state.vault.vaults
  // return useAppSelector(state => state.vault.vaults  
    .map(v => v.token?.address)
    .filter(v => !!v)
  ) as string[] | undefined
}

export const useUserBalances = (vaultDataLoaded: boolean, chainId?: number): { loading: boolean }  => {
  /**
    * Grab the user balances for each ERC20 token
    * In terms of:
    *  -- ERC20 in the wallet
    *  -- ERC20 in the vault
    *  -- Vault tokens
    */

  const [loading, setLoading] = useState(false);
  const { blockNumber } = useBlock();
  const { account, active } = useWeb3React();
  const dispatch = useAppDispatch();
  const tokenAddresses = useTokenAddresses()
  const monoAddresses = useAddresses();
  // const vaults = useProxySelector(state => state.vault.vaults.map(v => ({
  //   address: v.address,
  //   token: {
  //     address: v.token?.address,
  //     decimals: v.token?.decimals
  //   },
  //   stats: {
  //     batchBurnRound: v.stats?.batchBurnRound
  //   }
  // })))
  const vaults = useAppSelector(state => state.vault.vaults);
  const monoContracts = useMultipleMonoContract(monoAddresses, true, chainId)
  const tokenContracts = useMultipleTokenContract(tokenAddresses, true, chainId)
  console.debug('call', { blockNumber, chainId, account, active, tokenContracts, monoContracts })
  useEffect(() => {
    if (
      account &&
      active &&
      tokenContracts.length > 0 &&
      monoContracts.length > 0 &&
      chainId && chainMap[chainId]
    ) {
      setLoading(true);
      console.debug('call user')
      // Multicall contract executes promise all as a batch request
      Promise.all(
        tokenContracts.map(async token => {
          const vault = vaults.find(async v => v.token?.address === token.address);
          const mono = monoContracts.find(m => m.address === vault?.address);
          if (mono && vault && vault.token && vault.stats) {
            return {
              decimals: vault.token.decimals,
              address: mono.address,
              userBalanceData: await getUserBalances(token, mono, account, vault.stats?.batchBurnRound as number)
            };
          }
        })
      ).then(payload => {
        payload.filter(p => !!p).forEach(p => {
          const data = p && toUserBalances({
            address: p.address,
            userBalancedata: p.userBalanceData,
            decimals: p.decimals as number
          });
          if (data) dispatch(setUserBalances(data));
        })
        setLoading(false)
        })
      }
  }, [account, active, chainId, blockNumber, vaultDataLoaded])
  return { loading }
};
