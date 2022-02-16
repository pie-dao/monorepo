import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useMonoVaultContract } from "../../../../hooks/useContract";
import { useSelectedVault } from "../../../../hooks/useSelectedVault";
import { handleTransaction, useAwaitPendingStateChange, usePendingTransaction } from "../../../../hooks/useTransactionHandler";
import { useStatus, WITHDRAWAL } from "../../../../hooks/useWithdrawalStatus";
import { setAlert } from "../../../../store/app/app.slice";
import { prettyNumber } from "../../../../utils";
import StyledButton from "../../../UI/button";
import LoadingSpinner from "../../../UI/loadingSpinner";

function WithdrawButton ({ showAvailable }: { showAvailable?: boolean }) {
    const [withdrawing, setWithdrawing] = useState(false);
    const { chainId } = useWeb3Cache();
    const vault = useSelectedVault();
    const dispatch = useAppDispatch();
    const { account } = useWeb3React();
    const auxoContract = useMonoVaultContract(vault?.address);
    const vaultUnderlying = vault?.userBalances?.wallet;
    const available = vault?.userBalances?.batchBurn.available;
    const status = useStatus();
    const txPending = usePendingTransaction();

    const buttonText = showAvailable ? prettyNumber(available?.label) : 'WITHDRAW';
    
    const eventName = 'ExitBatchBurn';
    useAwaitPendingStateChange(vaultUnderlying?.value, eventName);

    const buttonDisabled = () => {
        const wrongStatus = status !== WITHDRAWAL.READY
        const wrongNetwork =  chainId !== vault?.network.chainId
        return wrongNetwork || withdrawing || wrongStatus || txPending; 
    }

    const makeWithdraw = async () => {
        try {
            if (auxoContract && account) {
                setWithdrawing(true)
                const tx = await auxoContract?.exitBatchBurn()
                await handleTransaction(tx, eventName, dispatch);
            }
        } catch (err) {
            dispatch(
                setAlert({
                    message: "There was a problem with the transaction",
                    type: "ERROR",
                })
            );
        } finally {
          setWithdrawing(false)
        }    
    }

    return (
        <StyledButton
            disabled={buttonDisabled()}
            onClick={makeWithdraw}
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