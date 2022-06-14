import React from 'react';
import { ethers } from 'ethers';
import { RPC_URLS } from '../../connectors';
import { SUPPORTED_CHAINS } from '../../utils/networks';
import { LibraryProvider } from '../../types/utilities';

/**
 * We borrow pretty heavily from Ribbon.finance here, but essentially we need to instantiate
 * Providers for all chains in the case that the current provider (using Web3React) is on a separate chain.
 * By wrapping a series of context objects into a single Meta context, this gives us access to all the relevant providers
 * as required by the application.
 */

export type Web3ContextData = {
  provider: LibraryProvider;
};

const ethereumProvider = new ethers.providers.JsonRpcProvider(
  RPC_URLS[SUPPORTED_CHAINS.MAINNET],
);

const ftmProvider = new ethers.providers.JsonRpcProvider(
  RPC_URLS[SUPPORTED_CHAINS.FANTOM],
);
const polygonProvider = new ethers.providers.JsonRpcProvider(
  RPC_URLS[SUPPORTED_CHAINS.POLYGON],
);

export const EthereumWeb3Context = React.createContext<Web3ContextData>({
  provider: ethereumProvider,
});

export const FTMWeb3Context = React.createContext<Web3ContextData>({
  provider: polygonProvider,
});

export const PolygonWeb3Context = React.createContext<Web3ContextData>({
  provider: ftmProvider,
});

// Use this meta context object to make all providers available in the application
export const Web3ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EthereumWeb3Context.Provider value={{ provider: ethereumProvider }}>
    <FTMWeb3Context.Provider value={{ provider: ftmProvider }}>
      <PolygonWeb3Context.Provider value={{ provider: polygonProvider }}>
        {children}
      </PolygonWeb3Context.Provider>
    </FTMWeb3Context.Provider>
  </EthereumWeb3Context.Provider>
);
