import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useMonoVaultContract } from "../../../../hooks/useContract";
import { useApproximatePendingAsUnderlying } from "../../../../hooks/useMaxDeposit";
import { useSelectedVault } from "../../../../hooks/useSelectedVault";
import { handleTx, useAwaitPendingStateChange, usePendingTransaction } from "../../../../hooks/useTransactionHandler";
import { useStatus, WITHDRAWAL } from "../../../../hooks/useWithdrawalStatus";
import { Vault } from "../../../../store/vault/Vault";
import { setVault } from "../../../../store/vault/vault.slice";
import { prettyNumber } from "../../../../utils";
import { addBalances, zeroBalance } from "../../../../utils/balances";
import StyledButton from "../../../UI/button";
import LoadingSpinner from "../../../UI/loadingSpinner";

function WithdrawButton ({ showAvailable }: { showAvailable?: boolean }) {
    const [withdrawing, setWithdrawing] = useState(false);
    const { chainId } = useWeb3Cache();
    const vault = useSelectedVault();
    const dispatch = useAppDispatch();
    const { library } = useWeb3React();
    const auxoContract = useMonoVaultContract(vault?.address);
    const vaultUnderlying = vault?.userBalances?.wallet;
    const available = vault?.userBalances?.batchBurn.available;
    const status = useStatus();
    const txPending = usePendingTransaction();
    const pendingSharesUnderlying = useApproximatePendingAsUnderlying();

    const buttonText = showAvailable ? prettyNumber(available?.label) : 'WITHDRAW';
    
    const eventName = 'ExitBatchBurn';
    useAwaitPendingStateChange(vaultUnderlying?.value, eventName);

    const buttonDisabled = () => {
        const wrongStatus = status !== WITHDRAWAL.READY
        const wrongNetwork =  chainId !== vault?.network.chainId
        return wrongNetwork || withdrawing || wrongStatus || txPending; 
    }

    const newMakeWithdraw = async () => {
        if (auxoContract) {
            setWithdrawing(true);
            const tx = await auxoContract?.exitBatchBurn()
            await handleTx({ tx, dispatch, library, onSuccess: () => {
                if (vault && vault.userBalances && vault.userBalances.batchBurn) {
                    const newVault: Vault = {
                        ...vault,
                        userBalances: {
                            ...vault.userBalances,
                            wallet: addBalances(vault.userBalances.wallet, pendingSharesUnderlying),
                            batchBurn: {
                                ...vault.userBalances.batchBurn,
                                shares: zeroBalance(),
                            }
                        }
                    };
                    dispatch(setVault(newVault));
                };
            }});
            setWithdrawing(false);
        }
    };

    return (
        <StyledButton
            disabled={buttonDisabled()}
            onClick={newMakeWithdraw}
            className="min-w-[60px]"
        >
            { 
                withdrawing
                    ? <LoadingSpinner />
                    : buttonText
            } 
        </StyledButton>
    )
}

export default WithdrawButton