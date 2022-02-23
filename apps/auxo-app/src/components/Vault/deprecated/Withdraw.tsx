import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { MissingDecimalsError } from "../../../errors";
import { useMonoVaultContract } from "../../../hooks/useContract";
import { useSelectedVault } from "../../../hooks/useSelectedVault"
import { Balance, Vault } from "../../../store/vault/Vault";
import StyledButton from "../../UI/button";
import { NotYetReadyToWithdrawError } from '../../../errors';
import LoadingSpinner from "../../UI/loadingSpinner";
import { zeroBalance } from "../../../utils/balances";
import { setReduceVaultTokens } from "../../../store/vault/vault.slice";
import { useAppDispatch } from "../../../hooks";
import { useWeb3Cache } from "../../../hooks/useCachedWeb3";
import { setAlert } from "../../../store/app/app.slice";
import { useRef } from "react";
import { useEffect } from "react";
import { WITHDRAWAL } from "../../../hooks/useWithdrawalStatus";
import { checkForEvent } from "../../../hooks/useTransactionHandler";


const getButtonText = (status: WITHDRAWAL): string => {
  switch (status) {
    case (WITHDRAWAL.NOTSTARTED): {
      return 'BEGIN WITHDRAW'
    } 
    case WITHDRAWAL.REQUESTED: {
      return 'INCREASE WITHDRAW'
    }
    case WITHDRAWAL.READY: {
      return 'REDEEM'
    }
    default: {
      return 'NEW WITHDRAW'
    }
  }
}

function WithdrawalButton ({
  sufficientBalance,
  withdrawal,
  vault,
  status,
  setWithdrawal
}: {
  sufficientBalance: boolean,
  withdrawal: Balance,
  setWithdrawal: (w: Balance) => void
  vault: Vault,
  status: WITHDRAWAL
}) {
  const { chainId } = useWeb3Cache()
  const { account } = useWeb3React();
  const [pending, setPending] = useState(false);
  const monoContract = useMonoVaultContract(vault.address);
  const dispatch = useAppDispatch();

  const firstwallet = useRef(true);
  const firstburn = useRef(true);

  useEffect(() => {
    if (!firstwallet.current) {
      dispatch(setAlert({
        message: 'Withdrawal Complete',
        type: 'SUCCESS'
      }))  
    } else {
      firstwallet.current = false;
    }
  }, [vault.userBalances?.wallet.value, dispatch])

  useEffect(() => {
    if (!firstburn.current) {
      dispatch(setAlert({
        message: 'Withdraw request confirmed',
        type: 'SUCCESS'
      }))  
    } else {
      firstburn.current = false;
    }
  }, [vault.userBalances?.batchBurn.shares.value, dispatch])

  const buttonDisabled = () => {
    const invalidDepost = status !== WITHDRAWAL.READY && (withdrawal.label <= 0);
    const insufficientBalance = !sufficientBalance;
    const wrongNetwork =  chainId !== vault.network.chainId
    return insufficientBalance || wrongNetwork || invalidDepost || pending; 
  }

  const enterBatchBurn = async () => {
    setPending(true)
    try {
      const tx = await monoContract?.enterBatchBurn(withdrawal.value);
      const confirm = tx && await checkForEvent(tx, 'EnterBatchBurn');
      if (confirm) {
        dispatch(setReduceVaultTokens(withdrawal));
        setWithdrawal(zeroBalance());
        dispatch(setAlert({
          message: 'Transaction approved...',
          type: 'PENDING',
          
        }))
      } else {
        dispatch(setAlert({
          message: 'There was a problem with the transaction',
          type: 'ERROR'
        }))
      }
    } catch (err) {
      console.debug(err);
    } finally {
      setPending(false);
    }
  }

  const exitBatchBurn = async () => {
    setPending(true)
    try {
      if (status === WITHDRAWAL.READY) {
        const tx = await monoContract?.exitBatchBurn();
        const confirm = tx && await checkForEvent(tx, 'ExitBatchBurn');
        if (!confirm) {
          dispatch(setAlert({
            message: 'There was a problem with the transaction',
            type: 'ERROR'
          }))
        } else {
          dispatch(setAlert({
            message: 'Transaction approved...',
            type: 'PENDING',
          }))
        }
      } else {
        throw new NotYetReadyToWithdrawError();
      }
    } catch (err) {
      console.debug(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {
        account &&
        <StyledButton
          disabled={buttonDisabled()}
          onClick={() => status === WITHDRAWAL.READY ? exitBatchBurn() : enterBatchBurn()}
          >{ pending ? <LoadingSpinner /> : getButtonText(status) }
        </StyledButton>     
      }
  </>
  )
}

export function WithdrawInput({ vault, status }: { vault: Vault, status: WITHDRAWAL }) {
  const decimals = vault.token?.decimals;
  const [withdrawal, setWithdrawal] = useState<Balance>({ label: 0, value: '0' });
  const vaultBalance = vault.userBalances?.vault
  const [sufficientBalance, setSufficientBalance] = useState(true);

  const handleMaxWithdrawal = () => {   
    setSufficientBalance(true);
    setWithdrawal({
      label: vaultBalance?.label ?? 0,
      value: vaultBalance?.value ?? '0'
    })
  }

  const handleWithdrawalChange = (value: string) => {
    if (decimals) {
      const num = (value === '' || !value || value === ' ') ? '0' : value; 
      const bigValue = BigNumber.from(num ?? '0').mul(BigNumber.from(10).pow(decimals));
      const d = {
        label: Number(num),
        value: bigValue.toString()
      }
      const suff = bigValue.lte(BigNumber.from(vaultBalance?.value ?? 0));
      setSufficientBalance(suff);
      setWithdrawal(d)  
    } else {
      throw new MissingDecimalsError()
    }
  }  
  return (
    <section className="input flex flex-col justify-between h-full w-full">
      <div className="flex flex-col justify-evenly w-full h-full px-5">
        { 
          status !== WITHDRAWAL.READY &&
            <div className="flex border-gray-200 rounded-lg border-2 px-5">
            <input
              type="number"
              min="0"
              max={vaultBalance?.label}
              className="focus:outline-none w-full p-1"
              value={withdrawal.label.toString()}
              onChange={(e) => handleWithdrawalChange(e.target.value)}
            />
            <button
              className="text-blue-300"
              onClick={() => handleMaxWithdrawal()}
              >MAX</button>
          </div>
        }
        <div>
          <WithdrawalButton
            sufficientBalance={sufficientBalance}
            withdrawal={withdrawal}
            setWithdrawal={setWithdrawal}
            status={status}
            vault={vault}
            />
        </div>
      </div>
      {  sufficientBalance ? '' : <p className="text-red-800">Insufficient Balance</p> }
    </section>
  )
}

export const WithdrawStatusBar = ({ status }: { status: WITHDRAWAL }) => {
  return (
    <div className="flex w-full justify-evenly">
      <div className={`text-sm w-1/2 ${status > 0 ? ' bg-orange-400' : 'bg-gray-400'}`}>REQUESTED</div>
      <div className={`text-sm w-1/2 ${status > 1 ? ' bg-blue-400' : 'bg-gray-400'}`}>READY</div>
    </div>
  )
}


