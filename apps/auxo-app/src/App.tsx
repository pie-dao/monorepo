import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/useOnChainData";
import Callout from "./components/Summary/Callout";
import VaultTable from "./components/Vault/VaultTable";
import VaultNetworks from "./components/Vault/VaultNetworks";
import { Routes, Route } from "react-router-dom";
import VaultActions from "./components/Vault/VaultActions";

const ChainDataComponent = () => {
  useSetWeb3Cache();
  const { loading } = useChainData();
  return <div>{loading}</div>;
};

const Home = () => (
  <>
    <Callout />
    <VaultNetworks />
    <VaultTable />
  </>
);

function App() {
  return (
    <div className="App text-center h-screen w-screen bg-gray-100">
      <Header />
      <ChainDataComponent />
      <section className="w-full flex flex-col absolute top-[56px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details" element={<VaultActions loading={false} />} />
        </Routes>
      </section>
      <Footer />
    </div>
  );
}

export default App;
