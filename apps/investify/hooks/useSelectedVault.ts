import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { find, isEmpty } from 'lodash';
import { useMemo } from 'react';
import { BigNumberString, Vault } from '../store/products/products.types';
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
  return vault?.decimals ?? 0;
};

export const useVaultActualBNBalance = (): BigNumber => {
  const vault = useSelectedVault();
  const decimals = useDecimals();
  return ethers.utils.parseUnits(vault?.balance ?? '0', decimals);
};

export const useVaultTokenBalance = (): BigNumberString => {
  const vault = useSelectedVault();
  return vault?.balance ?? '0';
};
