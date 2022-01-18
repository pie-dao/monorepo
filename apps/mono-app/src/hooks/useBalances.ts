import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useAppSelector } from ".";
import { Vault } from "../store/vault/vaultSlice";
import { useMonoVaultContract, useTokenContract } from "./useContract";

const selectAddresses = (vaults: Vault[], contract: keyof Vault['addresses']) => vaults.map((v) => v.addresses[contract]);

export const useMulticallUserBalances = () => {
  /**
   * Grab the user balances for each token across all vaults
   */
  const { account } = useWeb3React();
  const [balances, setBalances] = useState<Array<BigNumber| undefined>>([]);
  const tokens = useAppSelector((state) => selectAddresses(state.vault.vaults, 'token'));
  if (account) {  
    Promise.all(
      tokens.map((t) => {
        const tokenContract = useTokenContract(t);
        return tokenContract?.balanceOf(account);
      }),
    ).then((b) => setBalances(b));
  }
  return balances
};

export const useMulticallVaultDeposits = () => {
  /**
   * @dev we can use the single call to the vault and batch these together
   */
  const { account } = useWeb3React();
  const [balances, setBalances] = useState<Array<BigNumber| undefined>>([]);
  const tokens = useAppSelector((state) => selectAddresses(
    state.vault.vaults, 'vault'
  ));
  if (account) {  
    Promise.all(
      tokens.map((t) => {
        const mono = useMonoVaultContract(t);
        return mono?.balanceOfUnderlying(account)
      }),
    ).then((b) => setBalances(b));
  }
  return balances
};
