import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useMonoVaultContract, useTokenContract } from "../hooks/useContract";
import { Balance, Vault } from "../store/vault/Vault";
import { prettyNumber } from "../utils";
import { MissingDecimalsError } from "../errors";
import { Erc20 } from "../types/artifacts/abi";
import { useState } from "react";
import { useAppDispatch } from "../hooks";
import { setApproval } from "../store/vault/vault.slice";
import StyledButton from "./UI/button";
import CardItem from "./UI/cardItem";
import { useSelectedVault } from "../hooks/useSelectedVault";

const conditionallyApprove = async ({
  allowance,
  deposit,
  token,
  spender,
  dispatch
}: {
  allowance?: BigNumber,
  deposit: Balance,
  token: Erc20,
  spender: string,
  dispatch: ReturnType<typeof useAppDispatch>,
}): Promise<void> => {
  const depositValue = BigNumber.from(deposit.value);
  if (
    allowance && allowance.lt(depositValue)
  ) {
    const transaction = await token.approve(spender, depositValue)
    // dev - hook up to observer here!
    dispatch(setApproval(deposit))
  } else {
    console.debug('No need to increase approval')
  }
}

function DepositButton ({
  sufficientBalance,
  deposit,
  vault  
}: {
  sufficientBalance: boolean,
  deposit: Balance,
  vault: Vault,
}) {
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React();
  const monoContract = useMonoVaultContract(vault.address);
  const tokenContract = useTokenContract(vault.token?.address);
  const [depositing, setDepositing] = useState(false);
  const allowance = vault.userBalances?.allowance;

  const buttonDisabled = () => {
    const invalidDepost = deposit.label <= 0;
    const insufficientBalance = !sufficientBalance;
    const wrongNetwork =  chainId !== vault.network.chainId
    return insufficientBalance || wrongNetwork || invalidDepost; 
  }

  const onClick = () => {
    setDepositing(true)
    if (tokenContract && account) {
      conditionallyApprove(
      {
        allowance: BigNumber.from(allowance?.value),
        deposit,
        spender: vault.address,
        token: tokenContract,
        dispatch
      }
      ).then(() => {
        console.debug('approved')
        monoContract?.deposit(account, deposit.value).then(() => {
          console.debug('made deposit');
          // here we should await block confirmation
          // dispatch(setChainRefetch());
        })
      }).catch(() => console.debug('fail')).finally(() => setDepositing(false))
    }
  }
  return (
    <>
    <div className="ml-2">
      {
        account &&
        <StyledButton
          disabled={buttonDisabled()}
          onClick={() => onClick()}
          >{ depositing ? 'Depositing...' : 'DEPOSIT' }
        </StyledButton>
      }
    </div>
  </>
  )
}

function DepositInput({ vault }: { vault: Vault }) {
  const decimals = vault.token?.decimals;
  const [deposit, setDeposit] = useState<Balance>({ label: 0, value: '0' });
  const vaultBalance = vault.userBalances?.wallet
  const [sufficientBalance, setSufficientBalance] = useState(true);
  
  const handleMaxDeposit = () => {   
    setSufficientBalance(true);
    setDeposit({
      label: vaultBalance?.label ?? 0,
      value: vaultBalance?.value ?? '0'
    })
  }
  const handleDepositChange = (value: string) => {
    if (decimals) {
      const num = (value === '' || !value || value === ' ') ? '0' : value; 
      const bigValue = BigNumber.from(num ?? '0').mul(BigNumber.from(10).pow(decimals));
      const d = {
        label: Number(num),
        value: bigValue.toString()
      }
      const suff = bigValue.lte(BigNumber.from(vaultBalance?.value ?? 0));
      setSufficientBalance(suff);
      setDeposit(d)  
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
            value={deposit.label.toString()}
            onChange={(e) => handleDepositChange(e.target.value)}
          />
          <button
            className="text-blue-300 ml-3"
            onClick={() => handleMaxDeposit()}
            >MAX</button>
        </div>
        <DepositButton
          sufficientBalance={sufficientBalance}
          deposit={deposit}
          vault={vault}
          />
      </div>
      {  sufficientBalance ? '' : <p className="text-red-800">Insufficient Balance</p> }
    </section>
  )
}

function DepositCard({ loading }: { loading: boolean }) {
  const vault = useSelectedVault();
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="flex flex-col justify-evenly h-full items-center">
      <h1 className="text-3xl">Deposit {vault.name}</h1>
      <CardItem
          loading={loading}
          left="Vault Network"
          right={ vault.network.name }
      />
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
      <CardItem
          loading={loading}
          left={`Your Vault Token balance`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      <DepositInput vault={vault} />
    </section>     
  )
}

export default DepositCard;