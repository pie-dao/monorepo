export const SUPPORTED_CHAINS = {
  FANTOM: 250,
  POLYGON: 137,
} as const;

export type SUPPORTED_CHAIN_ID =
  typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];

export type NetworkDetail = {
  name: keyof typeof SUPPORTED_CHAINS;
  symbol: string;
  color: string;
  blockExplorer: string;
  fullNetworkDetails: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
};
export type ChainMap = Record<SUPPORTED_CHAIN_ID, NetworkDetail>;

export const chainMap: ChainMap = {
  [SUPPORTED_CHAINS.FANTOM]: {
    name: "FANTOM",
    color: "blue-700",
    symbol: "FTM",
    blockExplorer: "https://ftmscan.com",
    fullNetworkDetails: {
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
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    name: "POLYGON",
    color: "blue-700",
    symbol: "MATIC",
    blockExplorer: "https://polgonscan.com",
    fullNetworkDetails: {
      chainId: `0x${Number(SUPPORTED_CHAINS.POLYGON).toString(16)}`,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polgonscan.com"],
    },
  },
};

export const supportedChains = Object.values(chainMap).map(({ name }) => name);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number): boolean =>
  supportedChainIds.includes(chainId);

export const changeNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}): Promise<void> => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    if (!chainId) throw new Error("No Chain Id defined");
    if (!isChainSupported) throw new Error("Unsupported chain");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          // cast is safe due to guard above
          ...chainMap[chainId as SUPPORTED_CHAIN_ID].fullNetworkDetails,
        },
      ],
    });
  } catch (err) {
    console.debug(err);
  }
};
