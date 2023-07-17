import { ethers } from 'ethers';

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  GOERLI: 5,
  FANTOM: 250,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
} as const;

type ValueOf<T> = T[keyof T];
export type SupportedChains = ValueOf<typeof SUPPORTED_CHAINS>;

// can be swapped out for local host
export const MAINNET_RPC =
  process.env.NEXT_PUBLIC_MAINNET_RPC ?? 'https://eth.llamarpc.com';

export const RPC_URLS =
  process.env.NEXT_PUBLIC_TESTNET === 'true'
    ? {
        1: 'http://127.0.0.1:8545/',
        5: 'https://rpc.ankr.com/eth_goerli',
        137: 'https://polygon-rpc.com',
        250: 'http://127.0.0.1:8546',
      }
    : {
        1: MAINNET_RPC,
        5: 'https://goerli.infura.io/v3/eeb01ac87aad4a4e907e914fcfc8be8e',
        137: 'https://polygon-rpc.com',
        250: 'https://1rpc.io/ftm',
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
  (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

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
  [SUPPORTED_CHAINS.GOERLI]: {
    blockTime: 1,
    chainId: `0x${Number(SUPPORTED_CHAINS.GOERLI).toString(16)}`,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.infura.io/v3/eeb01ac87aad4a4e907e914fcfc8be8e'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    blockTime: 1,
    chainId: `0x${Number(SUPPORTED_CHAINS.ARBITRUM).toString(16)}`,
    chainName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [SUPPORTED_CHAINS.OPTIMISM]: {
    blockTime: 1,
    chainId: `0x${Number(SUPPORTED_CHAINS.OPTIMISM).toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
};
