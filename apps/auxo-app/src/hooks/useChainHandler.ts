import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useAppDispatch } from ".";
import { setAlert, clearAlert } from "../store/app/app.slice";
import {
  chainMap,
  isChainSupported,
  NetworkDetail,
  supportedChains,
} from "../utils/networks";

export const useChainHandler = (): NetworkDetail | undefined => {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const [chain, setChain] = useState<NetworkDetail | undefined>(undefined);
  useEffect(() => {
    if (chainId && isChainSupported(chainId)) {
      dispatch(clearAlert());
      setChain(chainMap[chainId]);
    } else {
      dispatch(
        setAlert({
          message: `You are currently connected to an unsupported chain, supported chains are ${supportedChains}`,
          show: true,
          type: "ERROR",
        })
      );
    }
  }, [chainId, dispatch]);
  return chain;
};
