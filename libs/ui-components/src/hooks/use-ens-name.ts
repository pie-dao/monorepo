import { useMemo, useState } from "react";
import type { Web3Provider } from "@ethersproject/providers";

export function useENSName(
  provider?: Web3Provider,
  account?: string | null
): string | null | undefined {
  const [ENSName, setENSName] = useState<string | null | undefined>();
  useMemo(async () => {
    if (provider && account) {
      try {
        const name = await provider.lookupAddress(account);
        setENSName(name);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [provider, account]);
  return ENSName;
}
