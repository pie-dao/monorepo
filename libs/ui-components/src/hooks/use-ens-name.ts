import { useEffect, useState } from "react";
import type { Web3Provider } from "@ethersproject/providers";

export function useENS(
  provider?: Web3Provider,
  accounts?: string[]
): (string | null)[] | undefined {
  const [ENSNames, setENSNames] = useState<(string | null)[] | undefined>();
  useEffect(() => {
    if (provider && accounts?.length && !ENSNames) {
      let stale = false;
      Promise.all(accounts.map((account) => provider.lookupAddress(account)))
        .then((ENSNames) => {
          if (!stale) {
            setENSNames(ENSNames);
          }
        })
        .catch((error) => {
          console.debug("Could not fetch ENS names", error);
        });
      return () => {
        stale = true;
      };
    }
  }, [provider, accounts]);

  return ENSNames;
}

export function useENSName(
  provider?: Web3Provider,
  account?: string | null
): string | null | undefined {
  const ENSNames = useENS(provider, account ? [account] : undefined);
  return ENSNames?.[0];
}
