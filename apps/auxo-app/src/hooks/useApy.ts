import { Vault } from '../store/vault/Vault';
import { zeroApyMessage } from '../utils';

export const useApy = (vault: Vault | undefined): string => {
  if (!vault) return '--';
  return zeroApyMessage(vault.stats?.currentAPY.label);
};
