import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { MissingDecimalsError } from "../errors";
import { useAppDispatch } from "../hooks";
import { useMonoVaultContract, useTokenContract } from "../hooks/useContract";
import { useSelectedVault } from "../hooks/useSelectedVault"
import { Balance, Vault } from "../store/vault/Vault";
import { Mono } from "../types/artifacts/abi";
import { prettyNumber } from "../utils";
import StyledButton, { SwitcherButton } from "./UI/button";
import CardItem from "./UI/cardItem"

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


function WithdrawalButtons ({
  sufficientBalance,
  withdrawal,
  vault,
  status
}: {
  sufficientBalance: boolean,
  withdrawal: Balance,
  vault: Vault,
  status: WITHDRAWAL
}) {
  const { account, chainId } = useWeb3React();
  const [withdrawing, setWithdrawing] = useState(false);
  const monoContract = useMonoVaultContract(vault.address);

  const buttonDisabled = () => {
    const invalidDepost = withdrawal.label <= 0;
    const insufficientBalance = !sufficientBalance;
    const wrongNetwork =  chainId !== vault.network.chainId
    return insufficientBalance || wrongNetwork || invalidDepost; 
  }

  const onClick = () => {
    setWithdrawing(true)
    monoContract?.enterBatchBurn(withdrawal.value).then(() => {
      console.debug('success')
    }).finally(() => {
      setWithdrawing(false)
    });
  }
  return (
    <>
      {
        account &&
      <div className="ml-2">
        <StyledButton
          disabled={buttonDisabled()}
          onClick={() => onClick()}
          >{ withdrawing ? 'Withdrawing...' : getButtonText(status) }
        </StyledButton>     
      </div>
      }
  </>
  )
}


function WithdrawInput({ vault, status }: { vault: Vault, status: WITHDRAWAL }) {
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
    <section className="input flex justify-between w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-grow border-gray-400 rounded-lg border-2 px-5">
          <input
            type="number"
            min="0"
            max={vaultBalance?.label}
            className="focus:outline-none w-full"
            value={withdrawal.label.toString()}
            onChange={(e) => handleWithdrawalChange(e.target.value)}
          />
          <button
            className="text-blue-300 ml-3"
            onClick={() => handleMaxWithdrawal()}
            >MAX</button>
        </div>
        <WithdrawalButtons
          sufficientBalance={sufficientBalance}
          withdrawal={withdrawal}
          status={status}
          vault={vault}
          />
      </div>
      {  sufficientBalance ? '' : <p className="text-red-800">Insufficient Balance</p> }
    </section>
  )
}

const WithdrawStatusBar = ({ status }: { status: WITHDRAWAL }) => {
  return (
    <div className="flex w-full justify-evenly">
      <div className={`mx-1 w-1/3 -skew-x-12 ${status > 0 ? ' bg-orange-400' : 'bg-gray-400'}`}>REQUESTED</div>
      <div className={`mx-1 w-1/3 -skew-x-12 ${status > 1 ? ' bg-blue-400' : 'bg-gray-400'}`}>READY</div>
      <div className={`mx-1 w-1/3 -skew-x-12 ${status > 2 ? ' bg-purple-400' : 'bg-gray-400'}`}>WITHDRAWN</div>
    </div>
  )
}

const useStatus = (): WITHDRAWAL => {
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