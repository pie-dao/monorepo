import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { USDCIcon } from "../../../../assets/icons/logos";
import { useAppDispatch } from "../../../../hooks";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useMonoVaultContract, useTokenContract } from "../../../../hooks/useContract";
import { useApprovalLimit, useSelectedVault, useVaultTokenBalance } from "../../../../hooks/useSelectedVault";
import { handleTransaction, useAwaitPendingStateChange } from "../../../../hooks/useTransactionHandler";
import { useStatus, WITHDRAWAL } from "../../../../hooks/useWithdrawalStatus";
import { setAlert } from "../../../../store/app/app.slice";
import { Balance } from "../../../../store/vault/Vault";
import { SetStateType } from "../../../../types/utilities";
import { AUXO_HELP_URL, prettyNumber } from "../../../../utils";
import { zeroBalance } from "../../../../utils/balances";
import StyledButton from "../../../UI/button";
import { LoadingSpinnerWithText } from "../../../UI/loadingSpinner";
import ExternalUrl from "../../../UI/url";
import InputSlider from "../InputSlider";

function ApproveWithdrawButton({ withdraw, setWithdraw }: { withdraw: Balance, setWithdraw: SetStateType<Balance> }) {
    const [approving, setApproving] = useState(false);
    const dispatch = useAppDispatch();
    const vault = useSelectedVault();
    const batchBurnShares = vault?.userBalances?.batchBurn.shares;
    const auxoContract = useMonoVaultContract(vault?.address);
    const status = useStatus();
    useAwaitPendingStateChange([batchBurnShares?.value]);

    const enterBatchBurn = async () => {
        try {
            if (auxoContract) {
                setApproving(true);
                const tx = await auxoContract?.enterBatchBurn(withdraw.value)
                await handleTransaction(tx, 'EnterBatchBurn', dispatch);
                setWithdraw(zeroBalance())
            } else {
                console.error('Missing contract details for selected vault')
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
            setApproving(false)
        }
    }

    return (
        <StyledButton
            disabled={withdraw.value === '0' || status === WITHDRAWAL.READY}
            onClick={enterBatchBurn}
        >
            { approving
                ? <LoadingSpinnerWithText text="Approving..." />
                : 'Request'
            }
        </StyledButton>
    )
}

function WithdrawActions({ withdraw, setWithdraw }: { withdraw: Balance, setWithdraw: SetStateType<Balance> }) {
    return (
        <div
            className="flex w-full justify-start items-center"
        >
                <button className="w-full flex justify-start ml-1 text-sm text-gray-500">
                    <ExternalUrl to={AUXO_HELP_URL + '#c49e2f5991784b7fbb9e7cfac16def3f'}>
                        <p><span className="underline decoration-baby-blue-dark">More Info</span> on withdrawals</p>
                    </ExternalUrl>
                </button>
                <ApproveWithdrawButton withdraw={withdraw} setWithdraw={setWithdraw}/>
            </div>
    )
}


function WithdrawInput() {
    const [withdraw, setWithdraw] = useState(zeroBalance());
    const currency = useSelectedVault()?.symbol;
    const balance = useVaultTokenBalance();
    const status = useStatus();
    const label = status === WITHDRAWAL.READY
        ? 'Ready to Withdraw'
        : prettyNumber(balance.label) + ' ' + currency
    return (
        <div 
            className="
            my-2 flex flex-col h-full w-full justify-evenly px-4
        ">
            <div className="mb-2 mt-4 flex justify-start items-center h-10 w-full">
                <div className="h-8 w-8"><USDCIcon /></div>
                <p className="text-gray-700 text-xl ml-3 mr-1">Withdraw {currency}</p>
            </div>
            <div className="my-1">
                <InputSlider 
                    value={withdraw}
                    setValue={setWithdraw}
                    max={balance}
                    label={label}
                />
            </div>
            <WithdrawActions withdraw={withdraw} setWithdraw={setWithdraw} />
        </div>
    )
}

export default WithdrawInput;