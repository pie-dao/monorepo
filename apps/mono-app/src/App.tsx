import { useState, useMemo } from 'react';
import VaultList from './components/VaultList';
import VaultExtended from './components/VaultDetails';
import Hero from './static/hero';
import Header from './components/Header';
import { useAppSelector } from './hooks';
import { useWeb3React } from '@web3-react/core';
import { useMulticallERC20Balances, useMulticallVaultDeposits, useUserCanWithdraw } from './hooks/useBalances';
import { ChainMap } from './constants';
import { Vault } from './store/vault/vaultSlice';
import WalletModal from './components/Wallet/WalletModal';
import { useMonoVaultContract, useTokenContract } from './hooks/useContract';


const useNetwork = (): string => {
  const { chainId } = useWeb3React();
  return Object.keys(ChainMap).find(key => ChainMap[key] === chainId) ?? 'Not Supported'
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
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.wallet ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Balances - Underlying</td>
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.vaultUnderlying ?? 'None').join(', ') }</td>
        </tr>
        <tr>
          <td className="tg-0pky">Vault Balances - Vault Tokens</td>
          <td className="tg-0pky">{ vaults.map(v => v.userBalances?.vault ?? 'None').join(', ') }</td>
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

function App() {
  const [show, setShow] = useState(false);
  const { loading } = useMulticallVaultDeposits()
  const data = useAppSelector(state => state.vault.vaults)
  return (
    <div className="App text-center">
      <Header setShow={setShow} />
      { show && <WalletModal setShow={setShow} />}
      <Data />
      <section id="content">
        <div className="spacer my-10 h-1" />
        <h1 className="text-3xl m-10">Vaults</h1>
        <VaultList loading={loading} />
      </section>
      <VaultExtended vault={data[0]} />
    </div>
  );
}

export default App;
