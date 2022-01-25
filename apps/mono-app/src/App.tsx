import VaultList from './components/VaultList';
import Header from './components/Header';
import { useOnChainData } from './hooks/useChainData';
import { useEagerConnect } from './hooks/useWeb3';

const FancyTitle = () => (
  <div className="flex flex-col">
  <h1 className="text-3xl my-5">
    <span className="text-purple-400">Cross Chain</span> 
    <span className="text-purple-400"> & </span>
    <span className="text-purple-400">Layer 2</span>
    <span className="text-purple-400"> | </span>
    <span className="text-cyan-400 my-2">Easy as 🥧</span>
  </h1>
  </div>
)

function App() {
  const triedEager = useEagerConnect();
  // useOnChainData is the global state initialiser
  const appLoading = useOnChainData();
  return (
    <div className="App text-center h-full w-full">
      <Header />
      <section id="content">
        <div className="spacer my-10 h-1" />
        <FancyTitle />
        <h1 className="text-3xl m-10">Vaults</h1>
        <VaultList loading={appLoading}/>
      </section>
    </div>
  );
}

export default App;
