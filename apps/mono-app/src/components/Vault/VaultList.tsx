import { useAppSelector } from "../../hooks";
import { useOnChainData } from "../../hooks/useChainData";
import { useSelectedVault } from "../../hooks/useSelectedVault";
import VaultActions from "./VaultActions";
import VaultModal from "./VaultModal";

const FancyTitle = () => (
  <div className="flex flex-col">
  <h1 className="text-3xl my-5">
    <span className="text-purple-400">Cross Chain</span> 
    <span className="text-purple-400"> & </span>
    <span className="text-purple-400">Layer 2</span>
    <span className="text-purple-400"> | </span>
    <span className="text-cyan-400 my-2">Easy as 🥧</span>
  </h1>
  </div>
)

const Vaults = () => {
  const vaults = useAppSelector(state => state.vault.vaults);
  return (
    <section
    id="vault-list"
    className="flex flex-row flex-wrap w-full items-center justify-center m-20"
  >
    {vaults.map(v => (
      <VaultModal key={v.symbol} vault={v} />
    ))}
  </section>
  )
}

const VaultList = (): JSX.Element => {
  const selectedVault = useSelectedVault();
  return (
  <div>
    <div className="h-screen flex flex-col w-screen justify-center items-center">
    <FancyTitle />
    <Vaults />
    </div>
    { selectedVault && <VaultActions loading={false} />}
  </div>
)};
export default VaultList;