import { VaultState } from "./Vault";
import { FTM } from './auxoVaults'

export const vaultState: VaultState = {
  vaults: FTM,
  selected: null,
  isLoading: false,
};