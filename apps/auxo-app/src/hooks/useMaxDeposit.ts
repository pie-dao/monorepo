import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Balance, Vault } from "../store/vault/Vault";
import { zeroBalance } from "../utils/balances";
import { useSelectedVault } from "./useSelectedVault";

const BigNumberMin = (b1: BigNumber, b2: BigNumber): BigNumber => {
    return b1.gt(b2) ? b2 : b1; 
}

export const useMaxDeposit = (): Balance => {
    /**
    * Return min of underlying balance or (cap - deposits)
    */
    const vault = useSelectedVault();
    const [balance, setBalance] = useState<Balance>(); 
    
    useEffect(() => {
        if (vault && vault.userBalances && vault.cap.underlying) {
            const currentDeposits = vault.userBalances?.vaultUnderlying;
            const capUnderlying = vault.cap.underlying;
            const inWallet = vault.userBalances.wallet;
            const pendingWithdrawal = vault.userBalances.batchBurn.shares;
            
            // take the total capped per user, and sub anything
            // currently deposited or pending withdrawal
            const BigMaxAllowed = BigNumber
                .from(capUnderlying.value)
                .sub(BigNumber.from(currentDeposits.value))
                .sub(BigNumber.from(pendingWithdrawal.value))

            // the value is then whichever is smaller: the amount
            // in the user's wallet, or the amount they are allowed to deposit
            const BigWallet = BigNumber.from(inWallet.value);
            const value: string = BigNumberMin(
                BigWallet, BigMaxAllowed
            ).toString();

            const label: number = Math.min(
                capUnderlying.label - (currentDeposits.label + pendingWithdrawal.label),
                inWallet.label  
            );

            setBalance({ value, label })
        }
    }, [vault]);

    return balance ?? zeroBalance();
}