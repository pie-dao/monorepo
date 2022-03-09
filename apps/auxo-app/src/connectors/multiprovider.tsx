import React, { useContext } from "react";
import { ethers } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { RPC_URLS } from ".";
import { SUPPORTED_CHAINS } from "../utils/networks";

/**
 * We borrow pretty heavily from Ribbon.finance here, but essentially we need to instantiate
 * Providers for all chains in the case that the current provider (using Web3React) is on a separate chain.
 * By wrapping a series of context objects into a single Meta context, this gives us access to all the relevant providers
 * as required by the application.
 */

export type Web3ContextData = {
  provider: BaseProvider;
};

const ftmProvider = new ethers.providers.StaticJsonRpcProvider(
  RPC_URLS[SUPPORTED_CHAINS.FANTOM]
);
const polygonProvider = new ethers.providers.StaticJsonRpcProvider(
  RPC_URLS[SUPPORTED_CHAINS.POLYGON]
);

export const FTMWeb3Context = React.createContext<Web3ContextData>({
  provider: polygonProvider,
});

export const PolygonWeb3Context = React.createContext<Web3ContextData>({
  provider: ftmProvider,
});

export const useWeb3Context = (chainId: number): Web3ContextData => {
  let context: React.Context<Web3ContextData>;
  switch (chainId) {
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

// Use this meta context object to make all providers available in the application
export const Web3ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  <FTMWeb3Context.Provider value={{ provider: ftmProvider }}>
    <PolygonWeb3Context.Provider value={{ provider: polygonProvider }}>
      {children}
    </PolygonWeb3Context.Provider>
  </FTMWeb3Context.Provider>;
};
