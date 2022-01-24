import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useUserBalances } from "../hooks/useBalances";
import { Vault } from "../store/vault/Vault";
import DepositWorkflow from "./Deposit";
import VaultModal from "./VaultModal";

const VaultList = (): JSX.Element => {
  const vaults = useAppSelector(state => state.vault.vaults);
  // const { balances } = useUserBalances();
  const [selectedVault, setSelectedVault] = useState<Vault>();
  // const balance = selectedVault && balances?.filter(b => b.vaultAddress === selectedVault?.address)
  // console.debug({ balance })
  return (
  <>
  <section
    id="vault-list"
    className="flex flex-row flex-wrap align-middle justify-center mb-10"
  >
    {vaults.map(v => (
      <VaultModal key={v.symbol} vault={v} setSelectedVault={setSelectedVault} />
    ))}
  </section>
  { selectedVault && <DepositWorkflow vault={selectedVault}/>}
  </>
)};
export default VaultList;