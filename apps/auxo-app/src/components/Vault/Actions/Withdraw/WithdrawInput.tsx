import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { useMonoVaultContract } from "../../../../hooks/useContract";
import { useSelectedVault, useVaultTokenBalance } from "../../../../hooks/useSelectedVault";
import { handleTx, useAwaitPendingStateChange, usePendingTransaction } from "../../../../hooks/useTransactionHandler";
import { useStatus, WITHDRAWAL } from "../../../../hooks/useWithdrawalStatus";
import { Balance, Vault } from "../../../../store/vault/Vault";
import { setVault } from "../../../../store/vault/vault.slice";
import { SetStateType } from "../../../../types/utilities";
import { AUXO_HELP_URL, prettyNumber } from "../../../../utils";
import { addBalances, subBalances, zeroBalance } from "../../../../utils/balances";
import { logoSwitcher } from "../../../../utils/logos";
import StyledButton from "../../../UI/button";
import LoadingSpinner from "../../../UI/loadingSpinner";
import ExternalUrl from "../../../UI/url";
import InputSlider from "../InputSlider";
import WithdrawButton from "./WithdrawButton";

function ApproveWithdrawButton({ withdraw, setWithdraw }: { withdraw: Balance, setWithdraw: SetStateType<Balance> }) {
    const [approving, setApproving] = useState(false);
    const dispatch = useAppDispatch();
    const vault = useSelectedVault();
    const batchBurnShares = vault?.userBalances?.batchBurn.shares;
    const auxoContract = useMonoVaultContract(vault?.address);
    const status = useStatus();
    const txPending = usePendingTransaction();
    const { library } = useWeb3React();

    const eventName = 'EnterBatchBurn';
    const succeeded = useAwaitPendingStateChange(batchBurnShares?.value, eventName);

    useEffect(() => {
        if (succeeded) {
            setWithdraw(zeroBalance())
        }
    }, [succeeded, setWithdraw])

    const newEnterBatchBurn = async () => {
        if (auxoContract) {
            setApproving(true);
            const tx = await auxoContract?.enterBatchBurn(withdraw.value)
            await handleTx({ tx, dispatch, library, onSuccess: () => {
                if (vault && vault.userBalances && vault.userBalances.batchBurn) {
                    const newVault: Vault = {
                        ...vault,
                        userBalances: {
                            ...vault.userBalances,
                            vault: subBalances(vault.userBalances.vault, withdraw),
                            batchBurn: {
                                ...vault.userBalances.batchBurn,
                                shares: addBalances(vault.userBalances.batchBurn.shares, withdraw),
                            }
                        }
                    };
                    dispatch(setVault(newVault));
                    setWithdraw(zeroBalance())
                };
            }});
            setApproving(false);
        }
    };

    return (
        <StyledButton
            disabled={withdraw.value === '0' || status === WITHDRAWAL.READY || txPending}
            onClick={newEnterBatchBurn}
        >
            { approving
                ? <LoadingSpinner />
                : 'Request'
            }
        </StyledButton>
    )
};

function WithdrawActions({ withdraw, setWithdraw }: { withdraw: Balance, setWithdraw: SetStateType<Balance> }) {
    return (
        <div
            className="flex w-full justify-start items-center"
        >
                <button className="w-full flex justify-start ml-1 text-sm text-gray-500">
                    <ExternalUrl to={AUXO_HELP_URL + '#c49e2f5991784b7fbb9e7cfac16def3f'}>
                        <p><span className="underline decoration-baby-blue-dark">More Info</span><span className="hidden sm:inline-block ml-1">on withdrawals</span></p>
                    </ExternalUrl>
                </button>
                <ApproveWithdrawButton withdraw={withdraw} setWithdraw={setWithdraw}/>
            </div>
    )
}


function WithdrawInput() {
    const [withdraw, setWithdraw] = useState(zeroBalance());
    const currency = useSelectedVault()?.symbol;
    const vault = useSelectedVault();
    const balance = useVaultTokenBalance();
    const status = useStatus();
    const label = status === WITHDRAWAL.READY
        ? 'Ready to Withdraw'
        : prettyNumber(balance.label) + ' auxo' + currency
    return (
        <div 
            className="
            sm:my-2 flex flex-col h-full w-full justify-evenly px-4
        ">
            <div className="mb-2 mt-4 flex justify-center sm:justify-start items-center h-10 w-full">
                <div className="h-6 w-6 sm:h-8 sm:w-8">{ logoSwitcher(vault?.symbol) }</div>
                <p className="text-gray-700 md:text-xl ml-3 mr-1">Convert auxo{currency} to {currency}</p>
            </div>
            {   (status === WITHDRAWAL.READY) ?
                <div className="h-64 bg-baby-blue-light rounded-xl p-3 text-baby-blue-dark mt-3 flex flex-col items-center justify-evenly">
                    <p className="text-4xl font-bold underline underline-offset-4 decoration-white">Ready to Withdraw</p>
                    <p className="">Withdraw your existing balance</p>
                    <WithdrawButton />
                </div>

                : 
                <>
                <div className="my-1">
                    <InputSlider 
                        value={withdraw}
                        setValue={setWithdraw}
                        max={balance}
                        label={label}
                    />
                </div>
                <WithdrawActions withdraw={withdraw} setWithdraw={setWithdraw} />
                </>
            }
        </div>
    )
}

export default WithdrawInput;