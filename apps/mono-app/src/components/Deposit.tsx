import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useMonoVaultContract, useTokenContract } from "../hooks/useContract";
import { useNetwork } from "../hooks/useNetwork";
import { Erc20 } from "../types/artifacts/abi";
import { Balance, Vault } from "../store/vault/Vault";
import { prettyNumber } from "../utils";

function useDecimals(contract?: Erc20) {
  const [decimals, setDecimals] = useState(0);
  contract && contract.decimals().then(d => setDecimals(d))
  return decimals
}

function useAllowance(contract?: Erc20, monoAddress?: string) {
  const { account, chainId } = useWeb3React();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  useEffect(() => {
    if (!!(account && contract && monoAddress)) {
      contract.allowance(account, monoAddress).then(d => setAllowance(d))
    }    
  }, [contract, monoAddress, account, chainId])  
  return allowance
}

function DepositButton ({
  sufficientBalance,
  deposit,
  vaultId  
}: {
  sufficientBalance: boolean,
  deposit: Balance,
  vaultId: string,
}) {
  const { account } = useWeb3React();
  const vault = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId))
  const monoContract = useMonoVaultContract(vault?.address ?? '0x0');
  const tokenContract = useTokenContract(vault?.token?.address ?? '0x0');
  const [depositing, setDepositing] = useState(false);
  const onClick = () => {
    setDepositing(true)
    console.debug('Click')
    tokenContract?.approve(monoContract?.address ?? '0x0', deposit.value)
    // .then(() => {
    //   console.log('Approved, depositing...')
      account 
        && monoContract?.deposit(account, deposit.value)
          .then(() => console.log('Success'))
          .catch(() => 'Fail')
          .finally(() => setDepositing(false))
  }
  return (
    <>
    <div >
      {
      account && <button
        disabled={!sufficientBalance}
        className={`ml-5 p-3  text-white rounded-lg shadow-lg ${ sufficientBalance ? 'bg-green-700' : 'bg-gray-700 shadow-none text-slate-500'}` }
        onClick={() => onClick()}
        >{ depositing ? 'Depositing...' : 'DEPOSIT' }</button>
      }
    </div>
  </>
  )
}

function DepositInput({ vaultId }: { vaultId: string }) {
  const vault = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId))
  const tokenContract = useTokenContract(vault?.token?.address ?? '0x0');
  const decimals = useDecimals(tokenContract) ?? 0;
  const [deposit, setDeposit] = useState<Balance>({ label: 0, value: '0' });
  const vaultBalance = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId)?.userBalances?.wallet)
  const [sufficientBalance, setSufficientBalance] = useState(true);
  
  const handleMaxDeposit = () => {   
    setSufficientBalance(true);
    setDeposit({
      label: vaultBalance?.label ?? 0,
      value: vaultBalance?.value ?? '0'
    })
  }
  const handleDepositChange = (value: string) => {
    const num = (value === '' || !value || value === ' ') ? '0' : value; 
    const bigValue = BigNumber.from(num ?? '0').mul(BigNumber.from(10).pow(decimals));
    const d = {
      label: Number(num),
      value: bigValue.toString()
    }
    const suff = bigValue.lte(BigNumber.from(vaultBalance?.value ?? 0));
    setSufficientBalance(suff);
    setDeposit(d)
  }  
  return (
    <section className="input flex flex-col">
      <label>
        Input a value to deposit:
      </label>
      <div className="flex">
      <div className="flex border-blue-700 border-2 px-5">
        <input
          type="number"
          className="focus:outline-none"
          value={deposit.label}
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
        vaultId={vaultId}
        />
      </div>
      {  sufficientBalance ? '' : <p className="text-red-800">Insufficient Balance</p> }
      <div>
        <p>Value: {deposit.value}</p>
        <p>Decimals: {decimals}</p>
      </div>
    </section>
  )
}


function DepositWorkflow({ vault }: { vault: Vault }) {

  const network = useNetwork();
  const tokenContract = useTokenContract(vault?.token?.address ?? '0x0');
  const monoContract = useMonoVaultContract(vault.address ?? '0x0');
  const allowance = useAllowance(tokenContract, vault.address)

  const decimals = vault?.token?.decimals; 
  const correctNetwork = network === vault?.network.name.toUpperCase();

  console.debug({
    network,
    vault,
    tokenContract,
    monoContract,
    allowance,
    decimals,
    correctNetwork
  })


  return (
    <section className="mt-10 h-96 flex items-center flex-col justify-center">
      
      <h1>Vault for {vault.name}</h1>
      ------
      <div>
        <p>Current Network {network}</p>
        <p>Vault Network <span className={ correctNetwork ? 'text-indigo-500' : 'text-red-800' }>{vault?.network.name.toUpperCase()}</span></p>
      </div>
      ------
       <div>
        <p>
        Your Account balance { prettyNumber(vault?.userBalances?.wallet.label) }
        </p>
        <p className="italic text-gray-600">Raw value { vault?.userBalances?.wallet.value ?? 0 }</p>
        <p></p>
      </div>
      -----
      <DepositInput vaultId={vault.symbol} />
      <div>
        Approved to spend? {(allowance ?? 0 / (10 ** Number(decimals))).toString()}
      </div>         
    </section>
  )
}

export default DepositWorkflow;