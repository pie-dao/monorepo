import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useMonoVaultContract } from "../../../../hooks/useContract";
import { useSelectedVault } from "../../../../hooks/useSelectedVault";
import { handleTransaction, useAwaitPendingStateChange } from "../../../../hooks/useTransactionHandler";
import { useStatus, WITHDRAWAL } from "../../../../hooks/useWithdrawalStatus";
import { setAlert } from "../../../../store/app/app.slice";
import { Balance } from "../../../../store/vault/Vault";
import { SetStateType } from "../../../../types/utilities";
import { prettyNumber } from "../../../../utils";
import StyledButton from "../../../UI/button";
import { LoadingSpinnerWithText } from "../../../UI/loadingSpinner";

function WithdrawButton () {
    const [withdrawing, setWithdrawing] = useState(false);
    const { chainId } = useWeb3Cache();
    const vault = useSelectedVault();
    const dispatch = useAppDispatch();
    const { account } = useWeb3React();
    const auxoContract = useMonoVaultContract(vault?.address);
    const vaultUnderlying = vault?.userBalances?.vaultUnderlying;
    const available = vault?.userBalances?.batchBurn.available;
    const status = useStatus();
    
    useAwaitPendingStateChange([vaultUnderlying?.value]);

    const buttonDisabled = () => {
        const wrongStatus = status !== WITHDRAWAL.READY
        const wrongNetwork =  chainId !== vault?.network.chainId
        return wrongNetwork || withdrawing || wrongStatus; 
    }

    const makeWithdraw = async () => {
        try {
            if (auxoContract && account) {
                setWithdrawing(true)
                const tx = await auxoContract?.exitBatchBurn()
                await handleTransaction(tx, 'ExitBatchBurn', dispatch);
            }
        } catch (err) {
            dispatch(
                setAlert({
                    message: "There was a problem with the transaction",
                    type: "ERROR",
                    show: true,
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
            className={
                'px-1' +
                !buttonDisabled()
                ? 'bg-baby-blue-dark'
                : 'bg-gray-400'
            }
        >
            { 
                withdrawing
                    ? <LoadingSpinnerWithText text="Withdrawing..." />
                    : prettyNumber(available?.label)
            } 
        </StyledButton>
    )
}

export default WithdrawButton