import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/useOnChainData";
import { Routes, Route } from "react-router-dom";
import VaultDetails from "./pages/Vault";
import AlertMessage from "./components/Header/AlertMessage";
import Home from "./pages/Home";

const ChainDataComponent = () => {
  
  useSetWeb3Cache();
  const { loading } = useChainData();
  return <div>{loading}</div>;
};

function App() {
  return (
    <div className="App text-center min-h-screen w-screen flex justify-center bg-gray-50">
      <section className=" max-w-[1440px] w-screen h-full min-h-screen justify-between flex flex-col items-center">
        <section className="h-full w-full flex flex-col justify-between items-center px-1 sm:px-5 md:px-10 lg:px-20">
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
