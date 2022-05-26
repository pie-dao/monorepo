import { useMemo } from 'react';
import { useProxySelector } from '../store';
import { useWeb3Cache } from './useCachedWeb3';

export const useIsCorrectNetwork = (address: string | undefined): boolean => {
  const vault = useProxySelector((state) =>
    state.vault.vaults.find((v) => v.address === address),
  );
  const { chainId } = useWeb3Cache();
  return useMemo(() => {
    return chainId === vault?.network.chainId;
  }, [vault, chainId]);
};
