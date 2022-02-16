import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import VaultTable from "../components/Vault/Home/VaultTable";
import { chainMap } from "../utils/networks";
import { SetStateType } from "../types/utilities";
import { useEffect } from "react";
import { useWindowWide } from "../hooks/useWindowWidth";
import VaultCardView from "../components/Vault/Home/VaultCard";

type ViewType = "TABLE" | "CARD";

const FancyTitle = () => (
  <section className="flex flex-col">
    <h1 className="font-primary text-2xl sm:text-3xl md:text-4xl flex flex-wrap items-center text-center text-gray-700 justify-center">
      <span>Cross Chain & Layer 2 </span>
      <span className="text-baby-blue-dark my-2 mx-5 font-semibold">
        Easy as 🥧
      </span>
    </h1>
  </section>
);

const Callout = (): JSX.Element => {
  return (
    <section className="w-full pb-5">
      <div
        className="
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    py-5 sm:py-2 sm:h-48
                    mx-5 sm:mx-3
                    bg-baby-blue-light
                "
      >
        <FancyTitle />
      </div>
    </section>
  );
};

const VaultHomeMenu: React.FC<{
  view: ViewType;
  setView: SetStateType<ViewType>;
}> = ({ view, setView }) => {
  const { chainId } = useWeb3React();
  const chain = chainId && chainMap[chainId];
  return (
    <section
      className="
            flex
            mb-5
            px-5 sm:px-3
            w-full
            justify-center
            "
    >
      {chain && (
        <div
          className="
                border-gray-500
                border-b-2
                w-full
                flex
                justify-between
                "
        >
          <div className="border-b-2 border-baby-blue-dark shadow-xl w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6">
            <p className="mb-2 text-gray-700 ">{chain.name}</p>
          </div>
          <section className="flex">
            <div
              className={
                (view === "CARD"
                  ? "bg-baby-blue-dark "
                  : " bg-white shadow-md") + " p-2 rounded-lg mb-1"
              }
              onClick={() => setView("CARD")}
            >
              <BsFillGrid3X3GapFill
                className={
                  view === "CARD" ? "fill-white" : "fill-baby-blue-dark"
                }
              />
            </div>
            <div
              className={
                (view === "TABLE"
                  ? "bg-baby-blue-dark "
                  : " bg-white shadow-md") + " p-2 rounded-lg mb-1 ml-1"
              }
              onClick={() => setView("TABLE")}
            >
              <GiHamburgerMenu
                className={
                  view === "TABLE" ? "fill-white" : "fill-baby-blue-dark"
                }
              />
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

const Home = () => {
  const DEFAULT_TO_MOBILE_SIZE = 600;
  const [view, setView] = useState<ViewType>("TABLE");
  const biggerThanMobile = useWindowWide(DEFAULT_TO_MOBILE_SIZE);
  useEffect(() => {
    biggerThanMobile ? setView("TABLE") : setView("CARD");
  }, [biggerThanMobile, setView]);
  return (
    <>
      <Callout />
      <VaultHomeMenu view={view} setView={setView} />
      {view === "TABLE" ? <VaultTable /> : <VaultCardView />}
    </>
  );
};
export default Home;
