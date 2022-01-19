import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState, useMemo, useEffect } from "react";
import { useActiveWeb3 } from './useWeb3';
import { getNameOfDeclaration } from "typescript";
import { useAppDispatch, useAppSelector } from ".";
import { setStats, UserBalances, Vault, setUserBalances, userCanWithdraw, Balance } from "../store/vault/vaultSlice";
import { Erc20, Mono } from "../types/artifacts/abi";
import { useMonoVaultContract, useMultipleContracts, useMultipleMonoContract, useMultipleTokenContract, useTokenContract } from "./useContract";
import { injected } from "../connectors";

const selectAddresses = (vaults: Vault[], contract: keyof Vault['addresses']) => vaults.map((v) => v.addresses[contract]);

type Awaited<T> = T extends PromiseLike<infer U> ? U : T
const reduxSetBalances = (
  dispatch: ReturnType<typeof useAppDispatch>,
  payload: Awaited<ReturnType<typeof getUserBalance>>[]
) => {
  payload.forEach(p => {
    dispatch(setUserBalances(p))
  })
}

const fromScaleDecimals = (n: number | BigNumber, decimals: number) => typeof n === 'number' ? n : Number(n.toBigInt() / 10n ** BigInt(decimals));
const fromScale = (n: number | BigNumber) => fromScaleDecimals(n, 18);

const toBalance = (n: number | BigNumber, decimals: number): Balance => ({
  label: fromScaleDecimals(n, decimals),
  value: String(n)
})

const getUserBalance = async (
  t: Erc20,
  account: string,
  v?: Mono
): Promise<UserBalances & { token: string }> => {
  const wallet = await t.balanceOf(account);
  const d = await t.decimals()
  const vault = v ? await v.balanceOf(account): -1;
  const vaultUnderlying = v ? await v.balanceOfUnderlying(account) : -1;
  return {
    token: t.address,
    wallet: toBalance(wallet, d),
    vault: toBalance(vault, d),
    vaultUnderlying: toBalance(vaultUnderlying, d)
  }
}

export const useUserCanWithdraw = () => {
  type CanWith = { canWithdraw: boolean, vault: string }
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React();
  const monoAddresses = useAppSelector((state) => selectAddresses(
    state.vault.vaults, 'vault'
    ));
  const base = monoAddresses.map(m => ({ canWithdraw: false, vault: m ?? '0x0'}))
  const [canWithdraw, setCanWithdraw] = useState<CanWith[]>(base);
  const monoContracts = useMultipleMonoContract(monoAddresses);
  if (account && monoContracts.length > 0) {
    setLoading(true);
    Promise.all(
      monoContracts.map(async m => {
        const canWithdraw = await userCanWithdraw(m, account)
        return {
          canWithdraw,
          vault: m.address
        }
      })
    ).then(usersCanWithdraw => {
      setLoading(false);
    })
  }
  return {
    loading,
  }
}

export const useMulticallERC20Balances = () => {
  /**
   * Grab the user balances for each ERC20 token
   * In terms of:
   *  -- ERC20 in the wallet
   *  -- ERC20 in the vault
   *  -- Vault tokens
   */
const dispatch = useAppDispatch();
const [loading, setLoading] = useState(false);
const { account, active } = useWeb3React();
const tokenAddresses = useAppSelector((state) => selectAddresses(
  state.vault.vaults, 'token'
));
const monoAddresses = useAppSelector((state) => selectAddresses(
  state.vault.vaults, 'vault'
));
const monoContracts = useMultipleMonoContract(monoAddresses)
const tokenContracts = useMultipleTokenContract(tokenAddresses)
const vaults = useAppSelector(state => state.vault.vaults)

useEffect(() => {
  if (account && active && tokenContracts.length > 0 && monoContracts.length > 0) {
    setLoading(true);
    // Multicall contract executes promise all as a batch request
    Promise.all(
      tokenContracts.map(async t => {
        // @dev - need to check m.UNDERLYING
        
        const vault = monoContracts.find(async mono => {
          const under = await mono.UNDERLYING();
          return under.toString() === t.address;
        })
        return await getUserBalance(t, account, vault)
      })
    ).then(payload => {
      reduxSetBalances(dispatch, payload)
      setLoading(false)
    })
  }
}, [account, active])
return { vaults, loading }
};


export const useMulticallVaultDeposits = () => {
  /**
   * @dev we can use the single call to the vault and batch these together
   */
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { account, active } = useWeb3React();
  const vaultAddresses = useAppSelector((state) => selectAddresses(
    state.vault.vaults, 'vault'
  ));
  const vaults = useAppSelector(state => state.vault.vaults)
  const monoContracts = useMultipleMonoContract(vaultAddresses)
  useEffect(() => {
    if (account && active && monoContracts.length > 0) {
      setLoading(true);
      // Multicall contract executes promise all as a batch request
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

const reduxSetStats = (dispatch: ReturnType<typeof useAppDispatch>, payload: [string, BigNumber, BigNumber][]) => {
  payload.forEach(([name, supply, profit]) => {
    const p = generatePayload(name, supply, profit)
    dispatch(setStats(p))
  })
}


const getVaultStats = async (vaults: Vault[], v: Mono) => {
  const name = vaults.find(vault => vault.addresses.vault === v.address)!.name
  return [
    name,
    await v.totalSupply(),
    await v.maxLockedProfit(),
  ] as [string, BigNumber, BigNumber]
}

const generatePayload = (name: string, supply: BigNumber, profit: BigNumber) => ({
  name,
  stats: {
    deposits: Number(supply.toBigInt() / 10n ** 18n),
    historicalAPY: 0,
    projectedAPY: Number(profit.toBigInt() / 10n ** 18n)
  }
})