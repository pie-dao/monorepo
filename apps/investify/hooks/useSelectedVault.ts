import { useWeb3React } from '@web3-react/core';
import { find, isEmpty } from 'lodash';
import { useMemo } from 'react';
import { BigNumberReference, Vault } from '../store/products/products.types';
import { zeroBalance } from '../utils/balances';
import { useAppSelector } from './index';

export const useSelectedVault = (
  address?: string | string[],
): Vault | undefined => {
  const { vaults, activeVault } = useAppSelector((state) => state.dashboard);
  const { account } = useWeb3React();
  const selectedVault = useMemo(() => {
    if (isEmpty(vaults) && !activeVault) return;
    return find(
      vaults,
      (v) => v.address?.toLowerCase() === activeVault.toLowerCase(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, vaults, account, activeVault]);
  return selectedVault;
};

export const useDecimals = (): number => {
  const vault = useSelectedVault();
  return vault?.token?.decimals ?? 0;
};

export const useVaultTokenBalance = (): BigNumberReference => {
  const vault = useSelectedVault();
  return vault?.userBalances?.vault ?? zeroBalance;
};

export const useApprovalLimit = (): { limit: BigNumberReference } => {
  /**
   * Determine current amount the vault is approved to spend
   * We can use this to determine whether to allow a deposit, or
   * request a higher limit
   */
  const vault = useSelectedVault();
  return { limit: vault?.userBalances?.allowance ?? zeroBalance };
};

export const useUserTokenBalance = (): BigNumberReference => {
  const vault = useSelectedVault();
  return vault?.userBalances?.wallet ?? zeroBalance;
};

export const useIsDepositor = (): boolean => {
  const vault = useSelectedVault();
  return !!vault?.auth.isDepositor;
};
