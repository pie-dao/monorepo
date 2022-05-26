import { useCallback, useContext, useMemo } from 'react';
import {
  EthereumWeb3Context,
  FTMWeb3Context,
  PolygonWeb3Context,
  Web3ContextData,
} from './MultipleProviderContext';
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_ID } from '../../utils/networks';

/**
 * @dev this is heavily borrowed again from ribbon, my comments are that instantiating a switch statment, just to unpack it into a separate
 * hook is a bit strange. The get function is what we want, but we have to go through a lot
 * of stages to deal with rules of hooks.
 *
 * @returns a callback function that provides a context dependent provider based on the chain id passed
 */
export const useWeb3Context = (chainId: number): Web3ContextData => {
  let context: React.Context<Web3ContextData>;
  switch (chainId) {
    case SUPPORTED_CHAINS.MAINNET: {
      context = EthereumWeb3Context;
      break;
    }
    case SUPPORTED_CHAINS.FANTOM: {
      context = FTMWeb3Context;
      break;
    }
    case SUPPORTED_CHAINS.POLYGON: {
      context = PolygonWeb3Context;
      break;
    }
    default: {
      context = FTMWeb3Context;
    }
  }
  return useContext(context);
};

export const useMultipleProvider = () => {
  const ethereumContextProvider = useWeb3Context(
    SUPPORTED_CHAINS.MAINNET,
  ).provider;
  const ftmContextProvider = useWeb3Context(SUPPORTED_CHAINS.FANTOM).provider;
  const polygonContextProvider = useWeb3Context(
    SUPPORTED_CHAINS.POLYGON,
  ).provider;

  const providers = useMemo(
    () => ({
      [SUPPORTED_CHAINS.MAINNET]: ethereumContextProvider,
      [SUPPORTED_CHAINS.FANTOM]: ftmContextProvider,
      [SUPPORTED_CHAINS.POLYGON]: polygonContextProvider,
    }),
    [ftmContextProvider, polygonContextProvider, ethereumContextProvider],
  );

  // handling the notfound case?
  const getProviderForChain = useCallback(
    (chainId: number) => providers[chainId as SUPPORTED_CHAIN_ID],
    [providers],
  );

  return {
    getProviderForNetwork: getProviderForChain,
  };
};
