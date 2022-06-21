import { ethers } from 'ethers';

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  FANTOM: 250,
  POLYGON: 137,
} as const;

type ValueOf<T> = T[keyof T];
export type SupportedChains = ValueOf<typeof SUPPORTED_CHAINS>;

const RPC_URLS = {
  1: 'https://rpc.ankr.com/eth',
  137: 'https://polygon-rpc.com',
  250: 'https://rpc.ankr.com/fantom',
};

export const config = Object.entries(RPC_URLS).reduce((obj, [chain, url]) => {
  return {
    ...obj,
    [chain]: {
      provider: new ethers.providers.JsonRpcProvider(url),
    },
  };
}, {});
export type SUPPORTED_CHAIN_ID =
  typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];

export type NetworkDetail = {
  chainId: string;
  blockTime: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
};
export type ChainMap = Record<SUPPORTED_CHAIN_ID, NetworkDetail>;
