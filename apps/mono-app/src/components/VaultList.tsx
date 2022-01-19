import { useAppSelector } from "../hooks";
import { Vault } from "../store/vault/vaultSlice";
import VaultModal from "./VaultModal";

const VaultList = (): JSX.Element => {
  const vaults = useAppSelector(state => state.vault.vaults)
  return (
  <section
    id="vault-list"
    className="min-h-screen flex flex-row flex-wrap align-middle justify-center mb-10"
  >
    {vaults.map((v) => (
      <VaultModal key={v.symbol} vault={v} />
    ))}
  </section>
)};
export default VaultList;