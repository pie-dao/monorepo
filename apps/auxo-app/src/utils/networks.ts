export type SUPPORTEDNETWORKS = "POLYGON" | "LOCAL" | "FANTOM" | "ETHEREUM";

export type NetworkDetails = {
  name: SUPPORTEDNETWORKS;
  chainId: number;
};

export type Networks = {
  [N in SUPPORTEDNETWORKS]: NetworkDetails;
};

export type _NetworkDetail = {
  name: SUPPORTEDNETWORKS;
  symbol: string;
  color: string;
};
export type ChainMap = Record<number, _NetworkDetail>;

export const chainMap: ChainMap = {
  137: {
    name: "POLYGON",
    color: "purple-700",
    symbol: "MATIC",
  },
  1: {
    name: "ETHEREUM",
    color: "blue-400",
    symbol: "ETH",
  },
  250: {
    name: "FANTOM",
    color: "blue-700",
    symbol: "FTM",
  },
};
