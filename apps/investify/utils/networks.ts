import { ethers } from 'ethers';

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  FANTOM: 250,
  POLYGON: 137,
} as const;

type ValueOf<T> = T[keyof T];
export type SupportedChains = ValueOf<typeof SUPPORTED_CHAINS>;

const RPC_URLS =
  process.env.NEXT_PUBLIC_TESTNET === 'true'
    ? {
        1: 'http://127.0.0.1:8545/',
        137: 'https://polygon-rpc.com',
        250: 'http://127.0.0.1:8546',
      }
    : {
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

export const chainMap: ChainMap = {
  [SUPPORTED_CHAINS.MAINNET]: {
    blockTime: 12,
    chainId: `0x${Number(SUPPORTED_CHAINS.MAINNET).toString(16)}`,
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://cloudflare-eth.com'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [SUPPORTED_CHAINS.FANTOM]: {
    blockTime: 1,
    chainId: `0x${Number(SUPPORTED_CHAINS.FANTOM).toString(16)}`,
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools/'],
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    blockTime: 1.5,
    chainId: `0x${Number(SUPPORTED_CHAINS.POLYGON).toString(16)}`,
    chainName: 'Polygon',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
};
