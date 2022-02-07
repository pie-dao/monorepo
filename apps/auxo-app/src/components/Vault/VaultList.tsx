import { useAppSelector } from "../../hooks";
import { useSelectedVault } from "../../hooks/useSelectedVault";
import VaultActions from "./VaultActions";
import VaultModal from "./VaultModal";

const Vaults = () => {
  const vaults = useAppSelector(state => state.vault.vaults);
  return (
    <section
    id="vault-list"
    className="flex flex-row flex-wrap w-full items-center justify-center m-20"
  >
    {vaults.map(v => (
      <VaultModal key={v.name} vault={v} />
    ))}
  </section>
  )
}

const VaultList = (): JSX.Element => {
  const selectedVault = useSelectedVault();
  return (
  <div>
    <div className="h-screen flex flex-col w-screen justify-center items-center">
    <Vaults />
    </div>
    { selectedVault && <VaultActions loading={false} />}
  </div>
)};
export default VaultList;