import VaultList from "./components/Vault/VaultList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/useOnChainData";
import Callout from "./components/Summary/Callout";

const ChainDataComponent = () => {
  useSetWeb3Cache();
  const { loading } = useChainData();
  return <div>{loading}</div>;
};

function App() {
  return (
    <div className="App text-center h-full w-full">
      <Header />
      <Callout />
      <section id="content">
        <div className="spacer my-10 h-1" />
        <ChainDataComponent />
        <VaultList />
      </section>
      <Footer />
    </div>
  );
}

export default App;
