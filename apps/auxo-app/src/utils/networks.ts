export type SUPPORTEDNETWORKS = "FANTOM";

export type NetworkDetail = {
  name: SUPPORTEDNETWORKS;
  symbol: string;
  color: string;
  blockExplorer: string;
};
export type ChainMap = Record<number, NetworkDetail>;

export const chainMap: ChainMap = {
  250: {
    name: "FANTOM",
    color: "blue-700",
    symbol: "FTM",
    blockExplorer: "https://ftmscan.com",
  },
};

export const supportedChains = Object.values(chainMap).map(({ name }) => name);
export const supportedChainIds = Object.keys(chainMap).map((s) => Number(s));

export const isChainSupported = (chainId: number): boolean =>
  !!chainMap[chainId];
