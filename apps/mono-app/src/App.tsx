import { useState, useMemo, useEffect } from 'react';
import VaultList from './components/VaultList';
import VaultExtended from './components/VaultDetails';
import Hero from './static/hero';
import Header from './components/Header';
import { useAppSelector } from './hooks';
import { useWeb3React } from '@web3-react/core';
import { useMulticallERC20Balances, useMulticallVaultDeposits, useUserCanWithdraw } from './hooks/useBalances';
import { ChainMap } from './constants';
import vaultSlice, { Balance, Vault } from './store/vault/vaultSlice';
import WalletModal from './components/Wallet/WalletModal';
import { useMonoVaultContract, useTokenContract } from './hooks/useContract';
import Card from './components/UI/card';
import { Erc20 } from './types/artifacts/abi';
import { BigNumber } from '@ethersproject/bignumber';


const useNetwork = (): string => {
  const { chainId } = useWeb3React();
  let network =  Object.keys(ChainMap).find(key => ChainMap[key] === chainId) ?? 'Not Supported';
  return network
}

const useVaults = (): Vault[] => {
  return useAppSelector(state => state.vault.vaults);
}

function Data() {
  const network = useNetwork();
  const vaults = useVaults();
  useMulticallERC20Balances()
  const monoUSDC = useAppSelector(state => state.vault.vaults.find(v => v.name === 'USDC'));
  const monoContract = useMonoVaultContract(monoUSDC?.addresses.vault ?? '0x0');
  const tokenContract = useTokenContract(monoUSDC?.addresses.token ?? '0x0')
  const deposit = () => {
    const amt = 1_000_000_000_000;
    monoContract && tokenContract?.approve(monoContract.address, amt).then(() => {
      monoContract?.deposit(amt).then(() => console.log('Success')).catch(() => 'Fail')
    })
  }
  return (
    <table className="h-screen w-full">
      <tbody>
        <tr>
          <td className="tg-0pky">Network</td>
          <td className="tg-0pky">{ network }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vaults</td>
          <td className="tg-0pky">{ vaults.map(v => v.name).join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Deposits</td>
          <td className="tg-0pky">{ vaults.map(v => v.stats?.deposits ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Max Profits</td>
          <td className="tg-0pky">{ vaults.map(v => v.stats?.projectedAPY ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Wallet Balances</td>
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.wallet.label ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Balances - Underlying</td>
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.vaultUnderlying.label ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Balances - Vault Tokens</td>
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.vault.label ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">User can Withdraw</td>
          <td className="tg-0pky">{ [false, false].join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Make a deposit</td>
          <td className="tg-0pky">
            <button
              onClick={() => deposit()}
              className="bg-red-500 rounded-lg shadow-lg p-5 text-white"
              >Deposit 100 Tokens</button>
          </td>
        </tr>                             
      </tbody>
    </table>
  )
}

function useDecimals(contract?: Erc20) {
  const [decimals, setDecimals] = useState(0);
  contract && contract.decimals().then(d => setDecimals(d))
  return decimals
}

function useAllowance(contract?: Erc20, monoAddress?: string) {
  const { account } = useWeb3React();
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  useEffect(() => {
    if (!!(account && contract && monoAddress)) {
      contract.allowance(account, monoAddress).then(d => setAllowance(d))
    }    
  }, [contract, monoAddress, account])  
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
  const vault = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId))
  const monoContract = useMonoVaultContract(vault?.addresses.vault ?? '0x0');
  const tokenContract = useTokenContract(vault?.addresses.token ?? '0x0');
  const [depositing, setDepositing] = useState(false);
  const onClick = () => {
    setDepositing(true)
    console.debug('Click')
    console.debug({ monoContract, tokenContract })
    tokenContract?.approve(monoContract?.address ?? '0x0', deposit.value)
    .then(() => {
      console.log('Approved, depositing...')
      monoContract?.deposit(deposit.value)
        .then(() => console.log('Success'))
        .catch(() => 'Fail')
        .finally(() => setDepositing(false))
    })
  }
  return (
    <>
    <div >
      <button
      disabled={!sufficientBalance}
      className={`ml-5 p-3  text-white rounded-lg shadow-lg ${ sufficientBalance ? 'bg-green-700' : 'bg-gray-700 shadow-none text-slate-500'}` }
      onClick={() => onClick()}
      >{ depositing ? 'Depositing...' : 'DEPOSIT' }</button>
    </div>
  </>
  )
}

function DepositInput({ vaultId }: { vaultId: string }) {
  const vault = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId))
  const tokenContract = useTokenContract(vault?.addresses.token ?? '0x0');
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

const prettyNumber = (n?: number): string => n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0'

function DepositWorkflow() {
  // const [deposit, setDeposit] = useState<Balance>({ label: 0, value: '0' });
  // const [depositing, setDepositing] = useState(false);
  const vaultId = 'USDC';
  const network = useNetwork();
  const vault = useAppSelector(state => state.vault.vaults.find(v => v.name === vaultId))
  const tokenContract = useTokenContract(vault?.addresses.token ?? '0x0');
  const monoContract = useMonoVaultContract(vault?.addresses.vault ?? '0x0');
  const allowance = useAllowance(tokenContract, vault?.addresses.vault)
  const decimals = useDecimals(tokenContract) ?? 0;
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
      
      <h1>Vault for {vaultId}</h1>
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
        <p className="italic text-gray-600">Raw value { vault?.userBalances?.wallet.value }</p>
        <p></p>
      </div>
      -----
      <DepositInput vaultId={vaultId} />
      <div>
        Approved to spend? {(allowance ?? 0 / (10 ** decimals)).toString()}
      </div>         
    </section>
  )
}


function App() {
  return (
    <div className="App text-center h-full w-full">
      <Header />
      <DepositWorkflow />
      <Data />
      <section id="content">
        <div className="spacer my-10 h-1" />
        <h1 className="text-3xl m-10">Vaults</h1>
        <VaultList />
      </section>
      <VaultExtended />
    </div>
  );
}

export default App;
