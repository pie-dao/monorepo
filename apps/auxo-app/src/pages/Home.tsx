import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { SUPPORTED_CHAINS } from "../utils/networks";
import { SetStateType } from "../types/utilities";
import { useEffect } from "react";
import { useWindowWide } from "../hooks/useWindowWidth";
import VaultCardView from "../components/Vault/Home/VaultCard";
import VaultTable from "../components/Vault/Home/VaultTable";
import {
  initialTableState,
  useVaultTableData,
} from "../hooks/useVaultTableSort";
import { useGlobalFilter, useSortBy, useTable } from "react-table";

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
          mx-5 sm:mx-3 md:mx-0
          bg-baby-blue-light
        "
      >
        <FancyTitle />
      </div>
    </section>
  );
};

type GlobalFilterProps = {
  filter: keyof typeof SUPPORTED_CHAINS;
  setFilter: SetStateType<keyof typeof SUPPORTED_CHAINS | "">;
};

// Filter vaults according to the network
const NetworkSorter = ({ filter, setFilter }: GlobalFilterProps) => {
  return (
    <section className="flex justify-start ml-0">
      {["", ...Object.keys(SUPPORTED_CHAINS)].map((chain, idx) => {
        const active = filter === chain || (!filter && !chain);
        return (
          <button
            className={`
              flex justify-center
              w-36 py-1
              text-gray-500 text-center
              ${
                active &&
                " border-b-2 border-baby-blue-dark text-baby-blue-dark"
              } `}
            key={idx}
            onClick={() => setFilter(chain as typeof filter)}
          >
            {chain === "" ? "ALL" : chain}
          </button>
        );
      })}
    </section>
  );
};

// toggle view between table and card using icons
const ViewSwitcher = ({
  view,
  setView,
}: {
  view: ViewType;
  setView: SetStateType<ViewType>;
}): JSX.Element => (
  <section className="flex">
    <div
      className={
        (view === "CARD" ? "bg-baby-blue-dark " : " bg-white shadow-md") +
        " p-2 rounded-lg mb-1"
      }
      onClick={() => setView("CARD")}
    >
      <BsFillGrid3X3GapFill
        className={view === "CARD" ? "fill-white" : "fill-baby-blue-dark"}
      />
    </div>
    <div
      className={
        (view === "TABLE" ? "bg-baby-blue-dark " : " bg-white shadow-md") +
        " p-2 rounded-lg mb-1 ml-1"
      }
      onClick={() => setView("TABLE")}
    >
      <GiHamburgerMenu
        className={view === "TABLE" ? "fill-white" : "fill-baby-blue-dark"}
      />
    </div>
  </section>
);

// Menu above the vault card and vault table, allows for switching views and filtering
const VaultHomeMenu: React.FC<
  {
    view: ViewType;
    setView: SetStateType<ViewType>;
  } & GlobalFilterProps
> = ({ view, setView, filter, setFilter }) => {
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
      <div
        className="
          border-gray-500
          border-b-2
          w-full
          flex
          justify-between
        "
      >
        <NetworkSorter filter={filter} setFilter={setFilter} />
        <ViewSwitcher view={view} setView={setView} />
      </div>
    </section>
  );
};

const Home = () => {
  const DEFAULT_TO_MOBILE_SIZE = 600;
  const [view, setView] = useState<ViewType>("TABLE");
  const biggerThanMobile = useWindowWide(DEFAULT_TO_MOBILE_SIZE);
  const { rows: data, headers: columns } = useVaultTableData();

  useEffect(() => {
    biggerThanMobile ? setView("TABLE") : setView("CARD");
  }, [biggerThanMobile, setView]);

  // global filter for table is shared with the cards, so we instantiate here
  const table = useTable(
    {
      columns,
      data,
      initialState: initialTableState,
    },
    useGlobalFilter,
    useSortBy
  );
  return (
    <>
      <Callout />
      <VaultHomeMenu
        view={view}
        setView={setView}
        setFilter={table.setGlobalFilter}
        filter={table.state.globalFilter}
      />
      {view === "TABLE" ? (
        <VaultTable tableProps={table} />
      ) : (
        <VaultCardView filter={table.state.globalFilter} />
      )}
    </>
  );
};
export default Home;
