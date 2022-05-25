import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '.';
import { useProxySelector } from '../store';
import { Balance, Vault } from '../store/vault/Vault';
import { setSelectedVault } from '../store/vault/vault.slice';
import { zeroBalance } from '../utils/balances';

export const useNavigateToVault = () => {
  /**
   * @returns a function that can be invoked to navigate to the passed vault page
   */
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectVault = (addr: string): void => {
    dispatch(setSelectedVault(addr));
    navigate(`/vault/${addr}`);
  };
  return selectVault;
};

export const useSelectedVault = (): Vault | undefined =>
  useProxySelector((state) =>
    state.vault.vaults.find((v) => v.address === state.vault.selected),
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

export const useIsDepositor = (): boolean => {
  const vault = useSelectedVault();
  return !!vault?.auth.isDepositor;
};

export const useDecimals = (): number => {
  const vault = useSelectedVault();
  return vault?.token.decimals ?? 0;
};
