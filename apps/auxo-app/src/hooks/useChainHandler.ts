import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useAppDispatch } from ".";
import { setAlert, clearAlert } from "../store/app/app.slice";
import {
  chainMap,
  isChainSupported,
  NetworkDetail,
  SUPPORTED_CHAIN_ID,
  supportedChains,
} from "../utils/networks";

export const useChainHandler = (): NetworkDetail | undefined => {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const [chain, setChain] = useState<NetworkDetail | undefined>(undefined);
  useEffect(() => {
    // Prevent flickering error when the app is loading
    if (!chainId) return;
    if (isChainSupported(chainId)) {
      dispatch(clearAlert());
      setChain(chainMap[chainId as SUPPORTED_CHAIN_ID]);
    } else {
      dispatch(
        setAlert({
          message: `You are currently connected to an unsupported chain, supported chains are: ${supportedChains}`,
          type: "ERROR",
          action: "SWITCH_NETWORK",
        })
      );
    }
  }, [chainId, dispatch]);
  return chain;
};
