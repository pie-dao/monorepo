import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/useOnChainData";
import Callout from "./components/Summary/Callout";
import VaultTable from "./components/Vault/Table/VaultTable";
import VaultTableNetworkSwitcher from "./components/Vault/Table/VaultNetworks";
import { Routes, Route } from "react-router-dom";
import VaultDetails from "./components/Vault/Details/VaultDetails";
import AlertMessage from "./components/Header/AlertMessage";

const ChainDataComponent = () => {
  useSetWeb3Cache();
  const { loading } = useChainData();
  return <div>{loading}</div>;
};

const Home = () => (
  <>
    <Callout />
    <VaultTableNetworkSwitcher />
    <VaultTable />
  </>
);

function App() {
  return (
    <div className="App text-center min-h-screen w-screen flex justify-center bg-gray-50">
      <section className=" max-w-[1440px] w-screen h-screen justify-between flex flex-col items-center">
        <section className="w-full h-full flex flex-col justify-between items-center px-20">
          <Header />
          <section className="h-full w-full relative">
            <AlertMessage />
            <ChainDataComponent />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vault/:vaultId" element={<VaultDetails />} />
            </Routes>
          </section>
        </section>
        <Footer />
      </section>
    </div>
  );
}

export default App;
