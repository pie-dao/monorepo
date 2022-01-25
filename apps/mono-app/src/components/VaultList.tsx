import { useAppSelector } from "../hooks";
import DepositCard from "./Deposit";
import VaultActions from "./VaultActions";
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
  { selectedVault && <VaultActions loading={loading} vault={selectedVault}/>}
  </>
)};
export default VaultList;