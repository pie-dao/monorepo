import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "ether-swr"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { setChainId } from "../store/app/app.slice";

export const useSetWeb3Cache = () => {
  const dispatch = useAppDispatch();
  const { chainId, account, active, library } = useWeb3React<Web3Provider>();
  useEffect(() => {
    if(chainId) dispatch(setChainId(chainId));
  }, [account, active, library])
}

export const useCachedChainId = () => {
  return useAppSelector(state => state.app.chainId);
}

export const useWeb3Cache = () => {
  const chainId = useCachedChainId();
  return {
    chainId
  }
}