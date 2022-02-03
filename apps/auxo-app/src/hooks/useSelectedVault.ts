import { useProxySelector } from "../store";
import { Vault } from "../store/vault/Vault";

export const useSelectedVault = (): Vault | undefined =>
  useProxySelector((state) =>
    state.vault.vaults.find((v) => v.address === state.vault.selected)
  );
