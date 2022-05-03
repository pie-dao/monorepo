import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSetWeb3Cache } from "./hooks/useCachedWeb3";
import { useChainData } from "./hooks/multichain/useMultiChainData";
import AlertMessage from "./components/Header/AlertMessage";

function App() {
  useSetWeb3Cache();
  useChainData();
  return (
    <div className="App text-center min-h-screen w-screen flex justify-center bg-gray-50">
      <section className=" max-w-[1440px] w-screen h-full min-h-screen justify-between flex flex-col items-center">
        <section className="h-full w-full flex flex-col justify-between items-center px-1 sm:px-5 md:px-10 lg:px-20">
          <Header />
          <section className="h-full w-full relative">
            <AlertMessage />
          </section>
        </section>
        <Footer />
      </section>
    </div>
  );
}

export default App;
