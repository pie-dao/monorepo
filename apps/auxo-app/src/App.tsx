import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/useOnChainData";
import Callout from "./components/Summary/Callout";
import VaultTable from "./components/Vault/VaultTable";
import VaultNetworks from "./components/Vault/VaultNetworks";
import { Routes, Route } from "react-router-dom";
import VaultDetails from "./components/Vault/Details/VaultDetails";

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
    <div className="App text-center h-full min-h-screen justify-between flex flex-col w-screen bg-gray-100">
      <section className="w-full h-full flex flex-col">
        <Header />
        <ChainDataComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details" element={<VaultDetails />} />
        </Routes>
      </section>
      <Footer />
    </div>
  );
}

export default App;
