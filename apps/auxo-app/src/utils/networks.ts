import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "../hooks";
import { setError } from "../store/app/app.slice";

export type SUPPORTEDNETWORKS = "FANTOM";

export type NetworkDetail = {
  name: SUPPORTEDNETWORKS;
  symbol: string;
  color: string;
};
export type ChainMap = Record<number, NetworkDetail>;

export const chainMap: ChainMap = {
  250: {
    name: "FANTOM",
    color: "blue-700",
    symbol: "FTM",
  },
};

export const supportedChains = Object.values(chainMap).map(({ name }) => name);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number): boolean =>
  !!chainMap[chainId];

export const useChainHandler = (): NetworkDetail | undefined => {
  const { chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  if (chainId && isChainSupported(chainId)) {
    dispatch(
      setError({
        message: undefined,
        show: false,
      })
    );
    return chainMap[chainId];
  } else {
    dispatch(
      setError({
        message: `You are currently connected to an unsupported chain, supported chains are ${supportedChains}`,
        show: true,
      })
    );
  }
};
