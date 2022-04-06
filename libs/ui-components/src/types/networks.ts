export const SUPPORTED_CHAINS = {
  FANTOM: 250,
  POLYGON: 137,
  MAINNET: 1,
} as const;

export type SUPPORTED_CHAIN_NAMES = keyof typeof SUPPORTED_CHAINS;

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
