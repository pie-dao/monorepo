import { useAppSelector } from "../hooks";
import { prettyNumber } from "../utils";

const VaultExtended = (): JSX.Element => {
  const vault = useAppSelector(state => state.vault.vaults[0]);
  return (
  <section
    id="vault-extended"
    className="
      w-screen min-h-screen 
      "
  >
    <h1 className="text-3xl m-5">Extended Info</h1>
    <section
      className="
        flex items-center justify-evenly
        h-full flex-wrap w-full
        "
    >
      <section
        className="
        lhs 
        border-blue-600 border-2 
        w-full
        min-h-[450px]
        h-2/3 sm:w-1/2
        order-2
        sm:order-1
        my-3
        flex
        flex-col

        justify-evenly
        text-left
        "
      >
        <section>
          <h3 className="text-xl ml-2 mb-5">{vault.name}</h3>
          <p className="ml-2 text-gray-700 italic">{vault.description}</p>
        </section>
        {vault.stats && <section className="stats flex flex-col">
          <div className="flex justify-between">
            <p className="ml-2">Total Deposits:</p>
            <p className="mr-2 font-bold">{prettyNumber(vault.stats.deposits.label)}</p>
          </div>
          <div className="flex justify-between">
            <p className="ml-2">Projected APY:</p>
            <p className="mr-2 font-bold">{vault.stats.currentAPY ?? 'N/A'} %</p>
          </div>
        </section>}
      </section>
      <section
        className="
        rhs 
        border-red-600 border-2
        w-full
        min-h-[100px]
        h-2/3 sm:w-1/3
        order-1
        sm:order-2
        my-3
        flex
        flex-col
        justify-center
        "
      >
        <form>
          <div className="flex justify-center mb-3">
            <div>Deposit</div>
            <div className="mx-5"> / </div>
            <div>Withdraw</div>
          </div>
          <div>
            <label htmlFor="amount" className="mx-2">
              Amount
            </label>
            <input type="number" id="amount" className="bg-green-50 text-right"></input>
          </div>
          <button type="submit" className="p-1 m-3 bg-gray-200 rounded-md w-48">
            Confirm
          </button>
        </form>
      </section>
    </section>
  </section>
)};
export default VaultExtended;