import { Vault } from "../store/vault/vaultSlice";
import { scrollTo } from "../utils/scroll";

const VaultModal = ({ vault, loading }: { vault: Vault, loading: boolean }): JSX.Element => (
  <div
    className="
    border-red-100 border-2 rounded-xl
    flex flex-col justify-evenly 
    w-[300px] sm:w-1/3
    h-[450px]
    p-5
    relative
    m-1
    bg-gray-200"
  >
    <img alt={vault.symbol + '-icon'} className="absolute top-3 left-3" />
    <h2 className="text-center text-lg italic m-5">{vault.name}</h2>
    <p>{vault.description}</p>
    { 
      loading 
        ? <p>Loading...</p>
        : vault.stats && 
        <div className="details">
          <p>Projected APY: {vault.stats.projectedAPY} %</p>
        </div> 
    }
    <section>
      <button
        className="
          bg-blue-500 border-2 border-blue-500
          hover:bg-transparent 
          rounded-md
          px-2 py-1 mx-1
          my-1
          min-w-[120px]
          "
        onClick={() => scrollTo('vault-extended', -1000)}
      >
        Deposit
      </button>
      <button
        className="
          border-blue-500 border-2 hover:bg-blue-500
          rounded-md 
          py-1 px-2 mx-1
          my-1
          min-w-[120px]
          "
        onClick={() => scrollTo('vault-extended', -1000)}
      >
        Withdraw
      </button>
    </section>
  </div>
);

export default VaultModal;