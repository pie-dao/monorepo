import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { USDCIcon } from "../../../../assets/icons/logos";
import { useMaxDeposit } from "../../../../hooks/useMaxDeposit";
import { useApprovalLimit, useSelectedVault, useUserTokenBalance } from "../../../../hooks/useSelectedVault";
import { Balance } from "../../../../store/vault/Vault";
import { compareBalances, zeroBalance } from "../../../../utils/balances";
import StyledButton from "../../../UI/button";
import InputSlider from "../InputSlider";
import { handleTransaction, useAwaitPendingStateChange } from '../../../../hooks/useTransactionHandler';
import { useAppDispatch } from "../../../../hooks";
import { useMonoVaultContract, useTokenContract } from "../../../../hooks/useContract";
import { setAlert } from "../../../../store/app/app.slice";
import { LoadingSpinnerWithText } from "../../../UI/loadingSpinner";
import { useWeb3Cache } from "../../../../hooks/useCachedWeb3";
import { useWeb3React } from "@web3-react/core";
import { prettyNumber } from "../../../../utils";
import { SetStateType } from "../../../../types/utilities";

function ApproveDepositButton({ deposit }: { deposit: Balance }) {
    const [approving, setApproving] = useState(false);
    const dispatch = useAppDispatch();
    const vault = useSelectedVault();
    const { limit } = useApprovalLimit();
    const tokenContract = useTokenContract(vault?.token.address);

    useAwaitPendingStateChange([limit]);

    const approveDeposit = async () => {
        try {
            if (tokenContract && vault?.address) {
                setApproving(true);
                const tx = await tokenContract?.approve(vault?.address, deposit.value)
                await handleTransaction(tx, 'Approval', dispatch);
            } else {
                console.error('Missing TX or account')
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
            disabled={deposit.value === '0' || compareBalances(limit, 'gte', deposit)}
            onClick={approveDeposit}
        >
            { approving
                ? <LoadingSpinnerWithText text="Approving..." />
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
    const vaultUnderlying = vault?.userBalances?.vaultUnderlying
    
    useAwaitPendingStateChange([vaultUnderlying?.value]);


    const buttonDisabled = () => {
        const invalidDepost = deposit.label <= 0;
        const sufficientApproval = compareBalances(limit, 'gte', deposit);
        const wrongNetwork =  chainId !== vault?.network.chainId
        return !sufficientApproval || wrongNetwork || invalidDepost || depositing; 
    }

    const makeDeposit = async () => {
        try {
            if (auxoContract && account) {
                setDepositing(true)
                const tx = await auxoContract?.deposit(account, deposit.value)
                await handleTransaction(tx, 'Deposit', dispatch);
                setDeposit(zeroBalance())
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
          setDepositing(false)
        }    
    }

    return (
        <>
        <div 
        className={`rounded-full p-2 
            ${
                !buttonDisabled()
                ? 'bg-baby-blue-dark'
                : 'bg-gray-600'
            }`
        }>
        <FaCheck className="fill-white w-4 h-4"/>
        </div>
        <StyledButton
            disabled={buttonDisabled()}
            onClick={makeDeposit}
            className={
                !buttonDisabled()
                ? 'bg-baby-blue-dark'
                : 'bg-gray-600'
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
    const max = useMaxDeposit();
    const currency = useSelectedVault()?.symbol;
    const balance = useUserTokenBalance();
    const label = prettyNumber(balance.label) + ' ' + currency
    return (
        <div 
            className="
            my-2 flex flex-col h-full w-full justify-evenly px-4
        ">
            <div className="mb-2 mt-4 flex justify-start items-center h-10 w-full">
                <div className="h-8 w-8 mr-3"><USDCIcon /></div>
                <p className="text-gray-700 text-xl ">Deposit in {currency}</p>
            </div>
            <div className="my-1">
                <InputSlider value={deposit} setValue={setDeposit} max={max} label={label}/>
            </div>
            <DepositActions deposit={deposit} setDeposit={setDeposit}/>
        </div>
    )
}

export default DepositInput;