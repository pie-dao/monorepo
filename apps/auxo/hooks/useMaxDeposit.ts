import { BigNumber } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { BigNumberReference } from '../store/products/products.types';
import { BigNumberMin, convertToUnderlying } from '../utils/balances';
import { zeroBalance } from '../utils/balances';
import { useDecimals, useSelectedVault } from './useSelectedVault';

export const useApproximatePendingAsUnderlying = (): BigNumberReference => {
  const vault = useSelectedVault();
  const decimals = useDecimals();
  const sharesPending = vault?.userBalances?.batchBurn.shares ?? zeroBalance;
  const exchangeRate = vault?.stats?.exchangeRate ?? zeroBalance;

  const underlying = useMemo(() => {
    if (!vault || !decimals || !sharesPending || !exchangeRate) return;
    return convertToUnderlying(sharesPending, exchangeRate, decimals);
  }, [vault, decimals, sharesPending, exchangeRate]);

  return underlying;
};

export const useMaxDeposit = (): BigNumberReference => {
  /**
   * Return min of underlying balance or (cap - deposits)
   */
  const vault = useSelectedVault();
  const pendingWithdrawal = useApproximatePendingAsUnderlying();
  const [balance, setBalance] = useState<BigNumberReference>();

  useEffect(() => {
    if (
      vault &&
      vault.userBalances &&
      vault.cap.underlying &&
      pendingWithdrawal
    ) {
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
  }, [
    vault,
    pendingWithdrawal?.label,
    pendingWithdrawal?.value,
    pendingWithdrawal,
  ]);

  return balance ?? zeroBalance;
};

export const useLocked = (): number => {
  /**
   * When computing total value locked in auxo, we take the deposits in underlying USDC
   * We also add the shares in the batch burn process, multiplied by the Exchange rate
   * NB: need to understand how much ER and Amount Per Share can differ
   */
  const vault = useSelectedVault();
  const amountDepositedUnderlying =
    vault?.userBalances?.vaultUnderlying ?? zeroBalance;
  const amountPendingUnderlying = useApproximatePendingAsUnderlying();
  return amountPendingUnderlying.label + amountDepositedUnderlying.label;
};
