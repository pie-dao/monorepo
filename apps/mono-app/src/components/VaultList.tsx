import { useAppSelector } from "../hooks";
import DepositWorkflow from "./Deposit";
import VaultModal from "./VaultModal";

const VaultList = ({ loading }: { loading: boolean }): JSX.Element => {
  const vaults = useAppSelector(state => state.vault.vaults);
  const selectedVault = useAppSelector(state => state.vault.vaults.find(v => v.address === state.vault.selected));
  return (
  <>
  <section
    id="vault-list"
    className="flex flex-row flex-wrap align-middle justify-center mb-10"
  >
    {vaults.map(v => (
      <VaultModal key={v.symbol} vault={v} />
    ))}
  </section>
  { selectedVault && <DepositWorkflow loading={loading} vault={selectedVault}/>}
  </>
)};
export default VaultList;