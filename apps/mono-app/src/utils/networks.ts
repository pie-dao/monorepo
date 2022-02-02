export enum ChainIds {
  LOCAL = 31337,
  POLYGON = 137,
  MAINNET = 1,
}

export const SupportedChains: Record<string, number> = {
  LOCAL: 31337,
  POLYGON: 137,
  MAINNET: 1,
};

export type SUPPORTEDNETWORKS = "POLYGON" | "LOCAL" | "AVALANCHE";

export type NetworkDetails = {
  name: string;
  chainId: number;
};

export type Networks = {
  [N in SUPPORTEDNETWORKS]: NetworkDetails;
};

export type _NetworkDetail = {
  name: string;
  symbol: string;
  color: string;
};
export type ChainMap = Record<number, _NetworkDetail>;

export const chainMap: ChainMap = {
  137: {
    name: "Polygon",
    color: "purple-700",
    symbol: "MATIC",
  },
  1: {
    name: "Ethereum",
    color: "blue-400",
    symbol: "ETH",
  },
};

export const NETWORKS: Networks = {
  POLYGON: {
    name: "Polygon",
    chainId: ChainIds.POLYGON,
  },
  LOCAL: {
    name: "localhost",
    chainId: ChainIds.LOCAL,
  },
  AVALANCHE: {
    name: "Avalanche",
    chainId: ChainIds.POLYGON,
  },
};
