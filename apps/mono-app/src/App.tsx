import { useState } from 'react';
import VaultList from './components/VaultList';
import VaultExtended from './components/VaultDetails';
import Hero from './static/hero';
import Header from './components/Header';
import { useAppSelector } from './hooks';

function App() {
  const [_, setShow] = useState(false);
  const data = useAppSelector(state => state.vault.vaults);
  return (
    <div className="App text-center">
      <Header setShow={setShow} />
      <Hero />
      <section id="content">
        <div className="spacer my-10 h-1" />
        <h1 className="text-3xl m-10">Vaults</h1>
        <VaultList vaults={data} />
      </section>
      <VaultExtended vault={data[0]} />
    </div>
  );
}

export default App;