import {
  SUPPORTED_CHAIN_ID,
  ChainMap,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAIN_NAMES,
} from '../types/types';

function filter<T extends object>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean,
) {
  const result: { [K in keyof T]?: T[K] } = {};
  (Object.keys(obj) as Array<keyof T>).forEach((name) => {
    if (predicate(obj[name], name)) {
      result[name] = obj[name];
    }
  });
  return result;
}

export const chainMap: ChainMap = {
  [SUPPORTED_CHAINS.MAINNET]: {
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
};

export const supportedChains = Object.values(chainMap).map(
  ({ chainName }) => chainName,
);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number | undefined): boolean =>
  chainId ? supportedChainIds.includes(chainId) : false;

export const filteredChainMap = (allowedChains: SUPPORTED_CHAIN_NAMES[]) => {
  const supportedChainsById = allowedChains.map((s) =>
    String(SUPPORTED_CHAINS[s]),
  );
  return filter(chainMap, (_value, key) => {
    return supportedChainsById.includes(String(key));
  });
};

/**
 * You cannot add mainnet as a network, so first we attempt to switch, then check the error code
 * At time of writing this works fine for the user but metamask logs its own error, which is messy.
 */

export const addNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}) => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found');
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainMap[chainId as SUPPORTED_CHAIN_ID]],
      });
      resolve(null);
    } catch (err) {
      console.warn('Could not add the network', err);
      reject(err);
    }
  });
};

export const switchNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}) => {
  return new Promise((resolve, reject) => {
    if (!window.ethereum) throw new Error('No crypto wallet found');
    if (!chainId) throw new Error('No Chain Id defined');
    if (!isChainSupported) throw new Error('Unsupported chain');
    // block time is not allowed
    const { ...params } = chainMap[chainId as SUPPORTED_CHAIN_ID];
    try {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: params.chainId }],
      });
      resolve(null);
    } catch (err) {
      reject(err);
      return err;
    }
  });
};

export const changeNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}) => {
  return new Promise((resolve, reject) => {
    try {
      switchNetwork({ chainId });
      resolve(null);
    } catch (err: any) {
      console.warn('Could not switch networks');
      if (err?.code === 4902) {
        console.warn('Network missing, attempting to add network...');
      } else {
        console.warn('Unexpected error switching networks', err);
      }
      reject(err);
    }
  });
};
