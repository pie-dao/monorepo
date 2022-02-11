import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { MissingDecimalsError } from "../../errors";
import { useMonoVaultContract } from "../../hooks/useContract";
import { useSelectedVault } from "../../hooks/useSelectedVault"
import { Balance, Vault } from "../../store/vault/Vault";
import { prettyNumber } from "../../utils";
import StyledButton from "../UI/button";
import CardItem from "../UI/cardItem";
import { NotYetReadyToWithdrawError } from '../../errors';
import LoadingSpinner from "../UI/loadingSpinner";
import { zeroBalance } from "../../utils/balances";
import { checkForEvent } from "../../utils/event";
import { setReduceVaultTokens } from "../../store/vault/vault.slice";
import { useAppDispatch } from "../../hooks";
import { useWeb3Cache } from "../../hooks/useCachedWeb3";
import { setAlert } from "../../store/app/app.slice";
import { useRef } from "react";
import { useEffect } from "react";

enum WITHDRAWAL {
  'NOTSTARTED',
  'REQUESTED',
  'READY',
  'COMPLETE'
}

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
        show: true,
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
        show: true,
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
          show: true
        }))
      } else {
        dispatch(setAlert({
          message: 'There was a problem with the transaction',
          show: true,
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
            show: true,
            type: 'ERROR'
          }))
        } else {
          dispatch(setAlert({
            message: 'Transaction approved...',
            type: 'PENDING',
            show: true
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

export const useStatus = (): WITHDRAWAL => {
  /**
  * (a) get user batched burn receipt by using userBatchBurnReceipts(address) (this will give you a Receipt { round, shares } object)
  * (b) check that round > 0 && shares > 0. If that is not the case, the user has no withdrawal pending.
  * (c) get current batched burn round using batchBurnRound() method (will redeploy the implementation contract in a moment so that you should be able to get that). 
  * (d) Compare user's round from step (a) and batchBurnRound from step (c). There are 2 cases:
  *   (1)  The batchBurnRound is greater than the user's round: the user has underlying waiting for him :))))
  *   (2) The batchBurnRound is  equal to the user's round: the user needs to wait for next burning event
  * In the first case you can check how much the user should receive by doing (receipt is the receipt from step (1) ):
  *   receipt.shares * batchBurns(batchBurn).amountPerShare
  */
  const vault = useSelectedVault();
  const batchBurnRound = vault?.stats?.batchBurnRound;
  const userBatchBurnRound = vault?.userBalances?.batchBurn.round;
  if (batchBurnRound && userBatchBurnRound) {
    if (batchBurnRound > userBatchBurnRound) {
      return WITHDRAWAL.READY;
    } else { 
      return WITHDRAWAL.REQUESTED;
    }
  }
  return WITHDRAWAL.NOTSTARTED;
}

const WithdrawCard = ({ loading }: { loading: boolean }) => {
  const vault = useSelectedVault();
  const status = useStatus();
  // const status = WITHDRAWAL.READY
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="flex flex-col justify-evenly h-full items-center">
      <h1 className="text-3xl">Withdraw {vault.name}</h1>
      <CardItem
          loading={loading}
          left="Vault Network:"
          right={ vault.network.name }
      />
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance:`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
      <CardItem
          loading={loading}
          left={`Your Vault Token balance:`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      <CardItem
          loading={loading}
          left={`Batch Burn Round:`}
          right={ prettyNumber(vault?.stats?.batchBurnRound) }
      />
      <CardItem
          loading={loading}
          left={`Your Batch Burn Round:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.round) }
      />            
      <CardItem
          loading={loading}
          left={`Shares Pending Withdrawal:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.shares.label ?? 0) }
      />      
      <CardItem
          loading={loading}
          left={`Available to withdraw:`}
          right={ prettyNumber(vault?.userBalances?.batchBurn.available.label ?? 0 ) }
      />
      <WithdrawStatusBar status={status} />
      <WithdrawInput vault={vault} status={status}/>
    </section>
  )
}
export default WithdrawCard