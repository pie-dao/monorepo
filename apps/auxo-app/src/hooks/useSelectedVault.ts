import { useProxySelector } from "../store";
import { Balance, Vault } from "../store/vault/Vault";
import { zeroBalance } from "../utils/balances";

export const useSelectedVault = (): Vault | undefined =>
  useProxySelector((state) =>
    state.vault.vaults.find((v) => v.address === state.vault.selected)
  );

export const useApprovalLimit = (): { limit: Balance } => {
  /**
   * Determine current amount the vault is approved to spend
   * We can use this to determine whether to allow a deposit, or
   * request a higher limit
   */
  const vault = useSelectedVault();
  return { limit: vault?.userBalances?.allowance ?? zeroBalance() };
};

export const useUserTokenBalance = (): Balance => {
  const vault = useSelectedVault();
  return vault?.userBalances?.wallet ?? zeroBalance();
};

export const useVaultTokenBalance = (): Balance => {
  const vault = useSelectedVault();
  return vault?.userBalances?.vault ?? zeroBalance();
};
