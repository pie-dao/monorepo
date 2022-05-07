import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { Balance } from '../store/vault/Vault';
import { BigNumberMin, convertToUnderlying } from '../utils';
import { zeroBalance } from '../utils/balances';
import { useDecimals, useSelectedVault } from './useSelectedVault';

export const useApproximatePendingAsUnderlying = (): Balance => {
  const vault = useSelectedVault();
  const decimals = useDecimals();
  const sharesPending = vault?.userBalances?.batchBurn.shares ?? zeroBalance();
  const exchangeRate = vault?.stats?.exchangeRate ?? zeroBalance();

  return convertToUnderlying(sharesPending, exchangeRate, decimals);
};

export const useMaxDeposit = (): Balance => {
  /**
   * Return min of underlying balance or (cap - deposits)
   */
  const vault = useSelectedVault();
  const pendingWithdrawal = useApproximatePendingAsUnderlying();
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    if (vault && vault.userBalances && vault.cap.underlying) {
      const currentDeposits = vault.userBalances?.vaultUnderlying;
      const capUnderlying = vault.cap.underlying;
      const inWallet = vault.userBalances.wallet;

      // take the total capped per user, and sub anything
      // currently deposited or pending withdrawal
      const BigMaxAllowed = BigNumber.from(capUnderlying.value)
        .sub(BigNumber.from(currentDeposits.value))
        .sub(BigNumber.from(pendingWithdrawal.value));

      // the value is then whichever is smaller: the amount
      // in the user's wallet, or the amount they are allowed to deposit
      const BigWallet = BigNumber.from(inWallet.value);
      const value: string = BigNumberMin(BigWallet, BigMaxAllowed).toString();

      const label: number = Math.min(
        capUnderlying.label - (currentDeposits.label + pendingWithdrawal.label),
        inWallet.label,
      );

      setBalance({ value, label });
    }
  }, [vault, pendingWithdrawal.label, pendingWithdrawal.value]);

  return balance ?? zeroBalance();
};
