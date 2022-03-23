import { SUPPORTED_CHAIN_ID, ChainMap, SUPPORTED_CHAINS } from "../types/types";

export const chainMap: ChainMap = {
  [SUPPORTED_CHAINS.MAINNET]: {
    blockTime: 12,
    chainId: `0x${Number(SUPPORTED_CHAINS.MAINNET).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://cloudflare-eth.com"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  [SUPPORTED_CHAINS.FANTOM]: {
    blockTime: 1,
    chainId: `0x${Number(SUPPORTED_CHAINS.FANTOM).toString(16)}`,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools/"],
    blockExplorerUrls: ["https://ftmscan.com"],
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    blockTime: 1.5,
    chainId: `0x${Number(SUPPORTED_CHAINS.POLYGON).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
};

export const supportedChains = Object.values(chainMap).map(
  ({ chainName }) => chainName
);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number | undefined): boolean =>
  chainId ? supportedChainIds.includes(chainId) : false;

/**
 * You cannot add mainnet as a network, so first we attempt to switch, then check the error code
 * At time of writing this works fine for the user but metamask logs its own error, which is messy.
 */

export const addNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      const { blockTime, ...params } = chainMap[chainId as SUPPORTED_CHAIN_ID];
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });
      resolve(null);
    } catch (err) {
      console.warn("Could not add the network", err);
      reject(err);
    }
  });
};

export const switchNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}) => {
  return new Promise(async (resolve, reject) => {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    if (!chainId) throw new Error("No Chain Id defined");
    if (!isChainSupported) throw new Error("Unsupported chain");
    // block time is not allowed
    const { blockTime, ...params } = chainMap[chainId as SUPPORTED_CHAIN_ID];
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
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
  return new Promise(async (resolve, reject) => {
    try {
      await switchNetwork({ chainId });
      resolve(null);
    } catch (err: any) {
      console.warn("Could not switch networks");
      if (err?.code === 4902) {
        console.warn("Network missing, attempting to add network...");
        await addNetwork({ chainId });
        await switchNetwork({ chainId });
      } else {
        console.warn("Unexpected error switching networks", err);
      }
      reject(err);
    }
  });
};
