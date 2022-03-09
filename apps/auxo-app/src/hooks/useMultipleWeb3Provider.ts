import { useCallback, useMemo } from "react";
import { useWeb3Context } from "../connectors/multiprovider";
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_ID } from "../utils/networks";

export const useMultipleProvider = () => {
  const ftmContextProvider = useWeb3Context(SUPPORTED_CHAINS.FANTOM).provider;
  const polygonContextProvider = useWeb3Context(
    SUPPORTED_CHAINS.POLYGON
  ).provider;
  const providers = useMemo(
    () => ({
      [SUPPORTED_CHAINS.FANTOM]: ftmContextProvider,
      [SUPPORTED_CHAINS.POLYGON]: polygonContextProvider,
    }),
    [ftmContextProvider, polygonContextProvider]
  );

  // handling the notfound case?
  const getProviderForNetwork = useCallback(
    (network: number) => providers[network as SUPPORTED_CHAIN_ID],
    [providers]
  );

  return {
    getProviderForNetwork,
  };
};
