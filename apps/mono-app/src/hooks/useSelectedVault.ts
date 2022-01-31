import { useAppSelector } from ".";
import { useProxySelector } from "../store";

export const useSelectedVault = () => useAppSelector(state => {
  // return useProxySelector(state => state.vault.vaults.find(v => v.address === state.vault.selected))
  return state.vault.vaults.find(v => v.address === state.vault.selected)
});
