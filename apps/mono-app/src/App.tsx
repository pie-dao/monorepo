import VaultList from './components/Vault/VaultList';
import Header from './components/Header';
import Footer from './components/Footer';
import { useOnChainData } from './hooks/useChainData';
import { useEagerConnect, useInactiveListener } from './hooks/useWeb3';
import ErrorMessage from './components/Header/ErrorMessage';
import { ConnectorGrid } from './components/ConnectorGrid';
import { useWeb3React } from '@web3-react/core';
import { network } from './connectors';
import { useEffect, useState } from 'react';
import { useSetWeb3Cache, useWeb3Cache } from './hooks/useCachedWeb3';
import { useOnChainVaultData } from './hooks/useVaultDetails';

const ChainDataComponent = () => {
  const loading = useOnChainData();
  return <div>{loading}</div>
}

function App() {
  useSetWeb3Cache();
  const loading = useOnChainData();
  return (
    <div className="App text-center h-full w-full">
      <Header />
      <section id="content">
        <div className="spacer my-10 h-1" />
        {/* <ChainDataComponent /> */}
        <VaultList />
      </section>
      <Footer />
      {/* <ConnectorGrid /> */}
    </div>
  );
}

export default App;
