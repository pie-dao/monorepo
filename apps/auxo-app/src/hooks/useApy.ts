import { Vault } from "../store/vault/Vault";
import { zeroApyMessage } from "../utils";

export const useApy = (vault: Vault | undefined): string => {
  if (!vault) return "--";
  const apyRaw = vault.stats?.currentAPY;
  const decimals = vault.token.decimals;
  // return zeroApyMessage(Number(apyRaw?.value) / 10 ** decimals);
  return zeroApyMessage(vault.stats?.currentAPY.label)
};
