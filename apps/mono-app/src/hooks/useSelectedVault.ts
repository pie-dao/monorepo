import { useAppSelector } from ".";

export const useSelectedVault = () => useAppSelector(state => {
  return state.vault.vaults.find(v => v.address === state.vault.selected)
});
