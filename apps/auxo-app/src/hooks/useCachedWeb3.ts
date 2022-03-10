import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { setChainId } from "../store/app/app.slice";
import { LibraryProvider } from "../types/utilities";
import { Web3Provider } from "@ethersproject/providers";

/**
 * useWeb3React makes a network call to fetch the chain id every time it is called
 * For rate-limited scenarios like using an infura RPC, we want to limit redundant network calls
 * This means fetching the chain from the connected provider once, and caching to the state unless it changes
 */

export const getChainFromLibrary = (
  library: LibraryProvider | undefined
): number | undefined => {
  return library?._network.chainId;
};

export const useSetWeb3Cache = () => {
  const dispatch = useAppDispatch();
  const { account, active, library } = useWeb3React<Web3Provider>();
  useEffect(() => {
    console.debug("set cache");
    const chainId = getChainFromLibrary(library);
    if (chainId) dispatch(setChainId(chainId));
  }, [account, active, library, dispatch]);
};

export const useCachedChainId = () => {
  return useAppSelector((state) => state.app.chainId);
};

export const useWeb3Cache = () => {
  const cacheHits = useRef({ x: 0, time: new Date().getTime() });
  useEffect(() => {
    const now = new Date().getTime();
    if (now > cacheHits.current.time) {
      cacheHits.current = {
        time: now,
        x: cacheHits.current.x + 1,
      };
    }
    console.debug("cache hits", cacheHits.current.x);
  }, []);
  const chainId = useCachedChainId();
  return {
    chainId,
  };
};
