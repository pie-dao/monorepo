import { useAppSelector } from "."
import { useProxySelector } from "../store"

export const useAddresses = () => {
  const addresses = useProxySelector(state => state.vault.vaults.map(v => v.address))

  // const addresses = useAppSelector(state => state.vault.vaults.map(v => v.address))
  return addresses
}