import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Balance } from "../store/vault/Vault";
import { zeroBalance } from "../utils/balances";
import { useSelectedVault } from "./useSelectedVault";

const BigNumberMin = (b1: BigNumber, b2: BigNumber): BigNumber => {
  return b1.gt(b2) ? b2 : b1;
};

export const useApproximatePendingAsUnderlying = (): Balance => {
  const vault = useSelectedVault();
  const sharesPending = vault?.userBalances?.batchBurn.shares ?? zeroBalance();
  const decimals = vault?.token.decimals;
  const exchangeRate = vault?.stats?.exchangeRate;

  const amountPendingUnderlying = BigNumber.from(sharesPending.value)
      .mul(exchangeRate?.value ?? 0)

  const amountPendingUnderlyingLabel = amountPendingUnderlying
    .div(
      BigNumber.from(10).pow((2*(decimals ?? 0)))
    )
      
  return {
    value: amountPendingUnderlying.toString(),
    label: amountPendingUnderlyingLabel.toNumber()
  }  
};

export const useMaxDeposit = (): Balance => {
  /**
   * Return min of underlying balance or (cap - deposits)
   */
  const vault = useSelectedVault();
  const sharesUnderlying = useApproximatePendingAsUnderlying();
  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    if (vault && vault.userBalances && vault.cap.underlying) {
      const currentDeposits = vault.userBalances?.vaultUnderlying;
      const capUnderlying = vault.cap.underlying;
      const inWallet = vault.userBalances.wallet;
      const pendingWithdrawal = sharesUnderlying;

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
        inWallet.label
      );

      setBalance({ value, label });
    }
  }, [vault]);

  return balance ?? zeroBalance();
};
