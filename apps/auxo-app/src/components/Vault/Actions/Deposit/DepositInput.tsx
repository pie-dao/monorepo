import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useMaxDeposit } from "../../../../hooks/useMaxDeposit";
import { useApprovalLimit, useSelectedVault, useUserTokenBalance } from "../../../../hooks/useSelectedVault";
import { Balance, Vault } from "../../../../store/vault/Vault";
import { addBalances, compareBalances, subBalances, zeroBalance } from "../../../../utils/balances";
import StyledButton from "../../../UI/button";
import InputSlider from "../InputSlider";
import { handleTx, useAwaitPendingStateChange, usePendingTransaction } from '../../../../hooks/useTransactionHandler';
import { useAppDispatch } from "../../../../hooks";
import { useMonoVaultContract, useTokenContract } from "../../../../hooks/useContract";
import { setAlert } from "../../../../store/app/app.slice";
import LoadingSpinner from "../../../UI/loadingSpinner";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useWeb3React } from "@web3-react/core";
import { prettyNumber } from "../../../../utils";
import { SetStateType } from "../../../../types/utilities";
import { logoSwitcher } from "../../../../utils/logos";
import { setVault } from "../../../../store/vault/vault.slice";

function ApproveDepositButton({ deposit }: { deposit: Balance }) {
    const [approving, setApproving] = useState(false);
    const dispatch = useAppDispatch();
    const vault = useSelectedVault();
    const { limit } = useApprovalLimit();
    const tokenContract = useTokenContract(vault?.token.address);
    const txPending = usePendingTransaction();
    const { library } = useWeb3React();

    const eventName = 'Approval';
    useAwaitPendingStateChange(limit, eventName);

    const approveDeposit = async () => {
        try {
            if (tokenContract && vault) {
                setApproving(true);
                const tx = await tokenContract?.approve(vault?.address, deposit.value)
                await handleTx({ library, tx, dispatch, onSuccess: () => {
                    if(!(vault && vault.userBalances)) return;
                    const newVault: Vault = {
                            ...vault,
                            userBalances: {
                                ...vault.userBalances,
                                allowance: deposit,
                            }
                        }
                    dispatch(setVault(newVault))
                    }
                });
            } else {
                throw new Error('Missing TX or account')
            }
        } catch (err) {
            dispatch(
                setAlert({
                  message: "There was a problem with the transaction",
                  type: "ERROR",
                })
              );
        } finally {
            setApproving(false)
        }
    };

    return (
        <StyledButton
            disabled={deposit.value === '0' || compareBalances(limit, 'gte', deposit) || txPending}
            onClick={approveDeposit}
        >
            { approving
                ? <LoadingSpinner />
                : 'Approve'
            }
        </StyledButton>
    )
}

function DepositButtons ({ deposit, setDeposit }: { deposit: Balance, setDeposit: SetStateType<Balance> }) {
    const [depositing, setDepositing] = useState(false);
    const { chainId } = useWeb3Cache();
    const vault = useSelectedVault();
    const dispatch = useAppDispatch();
    const { account } = useWeb3React();
    const auxoContract = useMonoVaultContract(vault?.address);
    const { limit } = useApprovalLimit();
    const txPending = usePendingTransaction();
    const { library } = useWeb3React();

    const buttonDisabled = () => {
        const invalidDepost = deposit.label <= 0;
        const sufficientApproval = compareBalances(limit, 'gte', deposit);
        const wrongNetwork =  chainId !== vault?.network.chainId
        return !sufficientApproval || wrongNetwork || invalidDepost || depositing || txPending; 
    }

    const makeDeposit = async () => {
        try {
            if (auxoContract && account) {
                setDepositing(true);
                const tx = await auxoContract?.deposit(account, deposit.value);
                await handleTx({ dispatch, library, tx, onSuccess: () => {
                    if (!(vault && vault.userBalances)) return
                    const newVault: Vault = {
                        ...vault,
                        userBalances: {
                            ...vault.userBalances,
                            wallet:  subBalances(vault.userBalances.wallet, deposit),
                            vaultUnderlying: addBalances(vault.userBalances.vaultUnderlying, deposit),
                        }
                    };
                    dispatch(setVault(newVault));
                    setDeposit(zeroBalance());
                }});
            } else {
                throw new Error('Missing TX or account')
            }
        } catch (err) {
            dispatch(
                setAlert({
                  message: "There was a problem with the transaction",
                  type: "ERROR",
                })
            );
        } finally {
            setDepositing(false);
        }
    };    
    return (
        <>
        <div 
        className={`rounded-full p-2 
            ${
                !buttonDisabled()
                ? 'bg-baby-blue-dark'
                : 'bg-gray-300'
            }`
        }>
        <FaCheck className='fill-white w-4 h-4'/>
        </div>
        <StyledButton
            disabled={buttonDisabled()}
            onClick={makeDeposit}
            className={
                !buttonDisabled()
                ? 'bg-baby-blue-dark'
                : 'bg-gray-300'
            }
        >
            Deposit
        </StyledButton>
        </>
    )
}

function DepositActions({ deposit, setDeposit }: { deposit: Balance, setDeposit: SetStateType<Balance> }) {
    return (
        <div
            className="flex justify-between items-center"
        >
            <ApproveDepositButton deposit={deposit} />
            <DepositButtons deposit={deposit} setDeposit={setDeposit} />
        </div>
    )
}

function DepositInput() {
    const [deposit, setDeposit] = useState(zeroBalance());
    const vault = useSelectedVault();
    const max = useMaxDeposit();
    const currency = useSelectedVault()?.symbol;
    const balance = useUserTokenBalance();
    const label = prettyNumber(balance.label) + ' ' + currency

    return (
        <div className="sm:my-2 flex flex-col h-full w-full justify-evenly px-4">
            <div className="mb-2 mt-4 flex justify-center sm:justify-start items-center h-10 w-full">
                <div className="h-6 w-6 sm:h-8 sm:w-8 mr-3">{ logoSwitcher(vault?.symbol) }</div>
                <p className="text-gray-700 md:text-xl">Deposit {currency}</p>
            </div>
            <div className="my-1">
                <InputSlider value={deposit} setValue={setDeposit} max={max} label={label}/>
            </div>
            <DepositActions deposit={deposit} setDeposit={setDeposit}/>
        </div>
    )
}

export default DepositInput;