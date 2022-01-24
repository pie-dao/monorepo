import { useAppSelector } from "."

export const useAddresses = () => {
  return useAppSelector(state => state.vault.vaults.map(v => v.address))
}