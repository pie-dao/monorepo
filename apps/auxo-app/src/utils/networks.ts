export type SUPPORTEDNETWORKS = "FANTOM";

export type NetworkDetail = {
  name: SUPPORTEDNETWORKS;
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
export type ChainMap = Record<number, NetworkDetail>;

export const chainMap: ChainMap = {
  250: {
    name: "FANTOM",
    color: "blue-700",
    symbol: "FTM",
    blockExplorer: "https://ftmscan.com",
    fullNetworkDetails: {
      chainId: `0x${Number(250).toString(16)}`,
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
};

export const supportedChains = Object.values(chainMap).map(({ name }) => name);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number): boolean =>
  !!chainMap[chainId];

export const changeNetwork = async ({
  chainId,
}: {
  chainId: number | null | undefined;
}): Promise<void> => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    if (!chainId) throw new Error("No Chain Id defined");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...chainMap[chainId].fullNetworkDetails,
        },
      ],
    });
  } catch (err) {
    console.debug(err);
  }
};
