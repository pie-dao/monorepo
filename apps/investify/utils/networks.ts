import { ethers } from 'ethers';

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  FANTOM: 250,
  POLYGON: 137,
  AVALANCHE: 41334,
  OPTIMISM: 11,
  ARBITRUM: 42161,
  GNOSIS: 100,
} as const;

type ValueOf<T> = T[keyof T];
export type SupportedChains = ValueOf<typeof SUPPORTED_CHAINS>;

const RPC_URLS = {
  1: 'https://rpc.ankr.com/eth',
  137: 'https://polygon-rpc.com',
  250: 'https://rpc.ankr.com/fantom',
  41334: 'https://rpc.ankr.com/avalanche',
  11: 'https://rpc.ankr.com/optimism',
  42161: 'https://rpc.ankr.com/arbitrum',
  100: 'https://rpc.ankr.com/gnosis',
};

export const config = Object.entries(RPC_URLS).reduce((obj, [chain, url]) => {
  return {
    ...obj,
    [chain]: {
      provider: new ethers.providers.JsonRpcProvider(url),
    },
  };
}, {});
