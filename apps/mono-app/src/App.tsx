import { useState, useMemo } from 'react';
import VaultList from './components/VaultList';
import VaultExtended from './components/VaultDetails';
import Hero from './static/hero';
import Header from './components/Header';
import { useAppSelector } from './hooks';
import { useActiveWeb3 } from './hooks/useWeb3';
import { useWeb3React } from '@web3-react/core';
import { useMulticallVaultDeposits } from './hooks/useBalances';

function App() {
  const [_, setShow] = useState(false);
  // const active = useActiveWeb3();
  // const { account } = useWeb3React();
  const { vaults: data, loading } = useMulticallVaultDeposits()
  console.debug({
    data, loading
  })
  return (
    <div className="App text-center">
      <Header setShow={setShow} />
      <Hero />
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
